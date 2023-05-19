/** nestjs */
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

/** dependencies */
import { DataSource, Repository } from "typeorm";
import { MedicalProgression } from "./entities/medical-progression.entity";
import { CreateMedicalProgressionDto } from "./dto/create-medical-progression.dto";
import { UpdateMedicalProgressionDto } from "./dto/update-medical-progression.dto";
import { MedicalRecordsService } from "../medical-records/medical-records.service";
////////////////////////////////////////////////////////////////////////////////

@Injectable()
export class MedicalProgressionService {
  constructor(
    @InjectRepository(MedicalProgression)
    private repository: Repository<MedicalProgression>,
    private service: MedicalRecordsService,
    private dataSource: DataSource
  ) {}

  async create(
    createMedicalProgressionDto: CreateMedicalProgressionDto,
    record: number
  ): Promise<MedicalProgression> {
    // check if medical record exists and is active
    const medRecord = await this.service.findOne(record);
    if (!medRecord || !medRecord.isActive)
      throw new UnauthorizedException("Medical record not found or not active");

    // create a query runner
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    // try to save medical progression
    try {
      const medProg = this.repository.create(createMedicalProgressionDto);
      medProg.medicalRecord = Promise.resolve(medRecord);
      await queryRunner.manager.save(medProg);
      await queryRunner.commitTransaction();
      // console.log(medProg.createdAtUnixTimestamp);
      // console.log({
      //   ...medProg,
      //   createdAtUnixTimestamp: medProg.createdAtUnixTimestamp,
      // });
      return medProg;
    } catch (err) {
      // rollback changes made in case of error
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      // release queryRunner after transaction
      await queryRunner.release();
    }
  }

  findAll(): Promise<MedicalProgression[]> {
    return this.repository.find();
  }

  async findOne(id: number): Promise<MedicalProgression | null> {
    const queryBuilder = this.repository
      .createQueryBuilder("medProg")
      .where("medProg.id = :id", { id });

    return await queryBuilder.getOne();
  }

  async update(
    id: number,
    updateMedicalProgressionDto: UpdateMedicalProgressionDto
  ) {
    // check if medical progression exists
    const medProg = await this.findOne(id);
    if (!medProg)
      throw new UnauthorizedException("Medical progression not found");

    // check if request for update is within 24 hours
    const now = new Date();
    const createdAt = new Date(medProg.createdAt);
    const diff = now.getTime() - createdAt.getTime();
    const diffHours = Math.ceil(diff / (1000 * 60 * 60));
    if (diffHours > 24)
      throw new UnauthorizedException(
        "Medical progression can only be updated within 24 hours"
      );

    // update medical progression using QueryBuilder
    await this.repository
      .createQueryBuilder()
      .update(MedicalProgression)
      .set(updateMedicalProgressionDto)
      .where("id = :id", { id })
      .execute();

    // return updated medical progression
    return await this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
