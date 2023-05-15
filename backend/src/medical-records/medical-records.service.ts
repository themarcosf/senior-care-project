/** nestjs */
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

/** dependencies */
import { Repository, DataSource } from "typeorm";

import { MedicalRecord } from "./entities/medical-records.entity";
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
    // create a query runner
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    // try to save medical record
    try {
      const medRecord = this.repository.create(createMedicalRecordDto);
      await queryRunner.manager.save(medRecord);
      await queryRunner.commitTransaction();
      return medRecord;
    } catch (err) {
      // rollback changes made in case of error
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      // release queryRunner after transaction
      await queryRunner.release();
    }
  }

  async findAll(loadRels?: boolean): Promise<MedicalRecord[]> {
    const queryBuilder = this.repository.createQueryBuilder("medRecord");

    loadRels
      ? queryBuilder.leftJoinAndSelect("medRecord.progressions", "progressions")
      : queryBuilder.loadAllRelationIds();

    return await queryBuilder.getMany();
  }

  async findOne(id: number): Promise<MedicalRecord | null> {
    const queryBuilder = this.repository
      .createQueryBuilder("medRecord")
      .leftJoinAndSelect("medRecord.progressions", "progression")
      .where("medRecord.id = :id", { id });

    return await queryBuilder.getOne();
  }

  update(id: number, updateMedicalRecordDto: UpdateMedicalRecordDto) {
    return "// TODO: implement update method";
  }

  remove(id: number) {
    return "// TODO: implement remove method";
  }
}
