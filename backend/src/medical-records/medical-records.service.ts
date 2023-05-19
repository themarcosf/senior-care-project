/** nestjs */
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

/** dependencies */
import { mkdir } from "fs";
import { Repository, DataSource } from "typeorm";

import { Api } from "./common/common.enum";
import { MedicalRecord } from "./entities/medical-records.entity";
import { PartialMedicalRecord } from "./medical-records.controller";
import { CreateMedicalRecordDto } from "./dto/create-medical-record.dto";
import { UpdateMedicalRecordDto } from "./dto/update-medical-record.dto";
////////////////////////////////////////////////////////////////////////////////

@Injectable()
export class MedicalRecordsService {
  constructor(
    @InjectRepository(MedicalRecord)
    private repository: Repository<MedicalRecord>,
    private dataSource: DataSource
  ) {}

  async create(
    createMedicalRecordDto: CreateMedicalRecordDto
  ): Promise<MedicalRecord> {
    // check if national id already exists
    if (
      await this.repository.findOne({
        where: { nationalId: createMedicalRecordDto.nationalId },
      })
    ) {
      throw new UnauthorizedException("National ID already exists");
    }

    // create a query runner
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    // try to save medical record
    try {
      const medRecord = this.repository.create(createMedicalRecordDto);
      await queryRunner.manager.save(medRecord);
      await queryRunner.commitTransaction();

      // create folder for medical tests
      const destination = `${Api.PATH}${medRecord.id}`;
      mkdir(destination, { recursive: true }, (err) => {
        if (err) new UnauthorizedException(err);
      });

      // return medical record
      return medRecord;
    } catch (err) {
      // rollback changes made in case of error
      await queryRunner.rollbackTransaction();
      console.log(err);
      throw new Error("An error ocurred while creating the medical record.");
    } finally {
      // release queryRunner after transaction
      await queryRunner.release();
    }
  }

  async findAll(order: "ASC" | "DESC"): Promise<PartialMedicalRecord[]> {
    // query medical records with progressions
    const recordsWithProgressions = await this.repository
      .createQueryBuilder("medRecord")
      .leftJoinAndSelect("medRecord.progressions", "progressions")
      .where("progressions.id IS NOT NULL")
      .orderBy("progressions.createdAt", order)
      .select([
        "medRecord.id",
        "medRecord.patientFullName",
        "progressions.createdAt",
      ])
      .getRawMany();

    // query medical records without progressions
    const recordsWithoutProgressions = await this.repository
      .createQueryBuilder("medRecord")
      .leftJoinAndSelect("medRecord.progressions", "progressions")
      .where("progressions.id IS NULL")
      .orderBy("medRecord.createdAt", order)
      .select(["medRecord.id", "medRecord.patientFullName"])
      .getRawMany();

    // concatenate both arrays, placing records without progressions first
    const allRecords = recordsWithoutProgressions.concat(
      recordsWithProgressions
    );

    // filter out older progressions
    const uniqueRecords = [];
    const recordMap: {
      [key: number]: {
        id: number;
        patientFullName: string;
        lastProgression: string;
      };
    } = {};

    allRecords.forEach((record) => {
      const {
        medRecord_id,
        medRecord_patientFullName,
        progressions_createdAt,
      } = record;

      if (
        !recordMap[medRecord_id] ||
        progressions_createdAt > recordMap[medRecord_id].lastProgression
      ) {
        recordMap[medRecord_id] = {
          id: medRecord_id,
          patientFullName: medRecord_patientFullName,
          lastProgression: progressions_createdAt,
        };
      }
    });

    for (const key in recordMap) {
      uniqueRecords.push(recordMap[key]);
    }

    // sort records by lastProgression
    return uniqueRecords.sort((a, b) => {
      if (a.lastProgression === undefined) {
        return -1; // Keep undefined values at the front
      } else if (b.lastProgression === undefined) {
        return 1; // Move undefined values to the front
      } else {
        return b.lastProgression.localeCompare(a.lastProgression); // Sort by lastProgression in descending order
      }
    });
  }

  async findOne(
    criteria: number | string,
    order?: "ASC" | "DESC"
  ): Promise<MedicalRecord | null> {
    if (!criteria) return null;

    const queryBuilder = this.repository
      .createQueryBuilder("medRecord")
      .leftJoinAndSelect("medRecord.progressions", "progression");

    if (typeof criteria === "number") {
      queryBuilder.where("medRecord.id = :id", { id: criteria });
    } else {
      queryBuilder.where("medRecord.patientFullName = :patientFullName", {
        patientFullName: criteria,
      });
    }

    if (order) {
      queryBuilder.orderBy("progression.createdAt", order);
    }

    return await queryBuilder.getOne();
  }

  async toggleStatus(id: number) {
    const record = await this.findOne(id);

    // check if record exists and is active
    if (!record || !record.isActive)
      throw new UnauthorizedException(
        "Medical record not found or is inactive"
      );

    // toggle isActive using QueryBuilder
    await this.repository
      .createQueryBuilder()
      .update(MedicalRecord)
      .set({ isActive: false })
      .where("id = :id", { id })
      .execute();

    // return toggled record
    return await this.findOne(id);
  }

  update(id: number, updateMedicalRecordDto: UpdateMedicalRecordDto) {
    return "// TODO: implement update method";
  }

  remove(id: number) {
    return "// TODO: implement remove method";
  }
}
