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
      medProg.medicalRecord = medRecord;
      await queryRunner.manager.save(medProg);
      await queryRunner.commitTransaction();
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

  findOne(id: number): Promise<MedicalProgression | null> {
    return this.repository.findOne({ where: { id } });
  }

  update(id: number, updateMedicalProgressionDto: UpdateMedicalProgressionDto) {
    return `This action updates a #${id} medicalProgression`;
  }

  async remove(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}