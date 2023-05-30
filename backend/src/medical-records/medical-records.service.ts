/** nestjs */
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

/** dependencies */
import { mkdir } from "fs";
import { Repository } from "typeorm";

import { Api } from "./common/common.enum";
import { User } from "../users/entities/user.entity";
import { MedicalRecord } from "./entities/medical-records.entity";
import { PartialMedicalRecord } from "./medical-records.controller";
import { CreateMedicalRecordDto } from "./dto/create-medical-record.dto";
import { UpdateMedicalRecordDto } from "./dto/update-medical-record.dto";
import { QueryRunnerFactory } from "../common/query-runner/query-runner.factory";
////////////////////////////////////////////////////////////////////////////////

@Injectable()
export class MedicalRecordsService {
  constructor(
    @InjectRepository(MedicalRecord)
    private repository: Repository<MedicalRecord>,
    private readonly queryRunner: QueryRunnerFactory
  ) {}

  async create(
    createMedicalRecordDto: CreateMedicalRecordDto,
    user: User
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
    this.queryRunner.connect();
    await this.queryRunner.startTransaction();

    // try to save medical record
    const medRecord = this.repository.create(createMedicalRecordDto);
    try {
      medRecord.createdBy = Promise.resolve(user);
      await this.queryRunner.commitTransaction(medRecord);

      // create folder for medical tests
      const destination = `${Api.PATH}${medRecord.id}`;
      mkdir(destination, { recursive: true }, (err) => {
        if (err) new UnauthorizedException(err);
      });

      // return medical record
      return medRecord;
    } catch (err) {
      // rollback changes made in case of error
      await this.queryRunner.rollbackTransaction();
      console.log(err);
      throw new Error("An error ocurred while creating the medical record.");
    } finally {
      // release queryRunner after transaction
      await this.queryRunner.release();
    }
  }

  async findAll(order: "ASC" | "DESC"): Promise<PartialMedicalRecord[]> {
    // query medical records with progressions
    const recordsWithProgressions = await this.repository
      .createQueryBuilder("medRecord")
      .leftJoinAndSelect("medRecord.progressions", "progressions")
      .where("progressions.id IS NOT NULL")
      .andWhere("medRecord.isClinicalActive = true")
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
      .andWhere("medRecord.isClinicalActive = true")
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

    // create a map of records with the last progression
    allRecords.forEach((record) => {
      const {
        medRecord_id,
        medRecord_patientFullName,
        progressions_createdAt,
      } = record;

      // check if record is already in map
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

    // push records into uniqueRecords array
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

  async findOne(criteria: number | string): Promise<MedicalRecord | null> {
    // create query of medical records with progressions
    const queryBuilder = this.repository
      .createQueryBuilder("medRecord")
      .leftJoinAndSelect("medRecord.progressions", "progression");

    // check if criteria is a number (id) or string (patientFullName)
    if (typeof criteria === "number") {
      queryBuilder.where("medRecord.id = :id", { id: criteria });
    } else {
      queryBuilder.where("medRecord.patientFullName = :patientFullName", {
        patientFullName: criteria,
      });
    }

    // return medical record
    return await queryBuilder.getOne();
  }

  async toggleClinicalStatus(id: number): Promise<MedicalRecord | null> {
    const record = await this.findOne(id);

    // check if record exists and is active
    if (!record || !record.clinicalStatus)
      throw new UnauthorizedException(
        "Medical record not found or is inactive"
      );

    // toggle isActive using QueryBuilder
    await this.repository
      .createQueryBuilder()
      .update(MedicalRecord)
      .set({ clinicalStatus: false })
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
