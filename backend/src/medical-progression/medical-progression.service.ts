/** nestjs */
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

/** dependencies */
import { DataSource, Repository } from "typeorm";
import { User } from "../users/entities/user.entity";
import { MedicalProgression } from "./entities/medical-progression.entity";
import { CreateMedicalProgressionDto } from "./dto/create-medical-progression.dto";
import { UpdateMedicalProgressionDto } from "./dto/update-medical-progression.dto";
import { MedicalRecordsService } from "../medical-records/medical-records.service";
import { ProgressionTypeService } from "../progression-type/progression-type.service";
////////////////////////////////////////////////////////////////////////////////

@Injectable()
export class MedicalProgressionService {
  constructor(
    @InjectRepository(MedicalProgression)
    private repository: Repository<MedicalProgression>,
    private readonly dataSource: DataSource,
    private readonly medicalRecordService: MedicalRecordsService,
    private readonly progressionTypeService: ProgressionTypeService
  ) {}

  async create(
    createMedicalProgressionDto: CreateMedicalProgressionDto,
    medicalRecord: number,
    createdBy: User,
    progressionType: number
  ): Promise<MedicalProgression> {
    // check if medical record exists and is active
    const medRecord = await this.medicalRecordService.findOne(medicalRecord);
    if (!medRecord || !medRecord.clinicalStatus)
      throw new UnauthorizedException("Medical record not found or not active");

    // check progression type
    const progType = await this.progressionTypeService.findOne(progressionType);
    if (!progType)
      throw new UnauthorizedException("Progression type not found");

    // create a query runner
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    // try to save medical progression with relations
    const medProg = this.repository.create(createMedicalProgressionDto);
    try {
      medProg.medicalRecord = Promise.resolve(medRecord);
      medProg.progressionType = Promise.resolve(progType);
      medProg.createdBy = Promise.resolve(createdBy);
      await queryRunner.manager.save(medProg);
      await queryRunner.commitTransaction();
    } catch (err) {
      // rollback changes made in case of error
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      // release queryRunner after transaction
      await queryRunner.release();
    }

    // toggle medical record active status if progressionType.toggleStatus is true
    if (progType.toggleClinicalStatus) {
      await this.medicalRecordService.toggleClinicalStatus(medRecord.id);
    }

    // return created medical progression
    return medProg;
  }

  findAll(): Promise<MedicalProgression[]> {
    // create query builder
    const queryBuilder = this.repository
      .createQueryBuilder("medProg")
      .orderBy("medProg.createdAt", "DESC");

    // add relations to query builder
    queryBuilder
      .leftJoinAndSelect("medProg.medicalRecord", "medRecord")
      .leftJoinAndSelect("medProg.progressionType", "progType");

    // return medical progressions
    return queryBuilder.getMany();
  }

  async findOne(id: number): Promise<MedicalProgression | null> {
    // create query builder
    const queryBuilder = this.repository
      .createQueryBuilder("medProg")
      .where("medProg.id = :id", { id });

    // add relations to query builder
    queryBuilder
      .leftJoinAndSelect("medProg.medicalRecord", "medRecord")
      .leftJoinAndSelect("medProg.progressionType", "progType");

    // return medical progression
    return await queryBuilder.getOne();
  }

  async update(
    id: number,
    updateMedicalProgressionDto: UpdateMedicalProgressionDto
  ): Promise<MedicalProgression | null> {
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
