/** nestjs */
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

/** dependencies */
import { Repository } from "typeorm";
import { MedicalProgression } from "./entities/medical-progression.entity";
import { CreateMedicalProgressionDto } from "./dto/create-medical-progression.dto";
import { UpdateMedicalProgressionDto } from "./dto/update-medical-progression.dto";
import { MedicalRecordsService } from "../medical-records/medical-records.service";
////////////////////////////////////////////////////////////////////////////////

@Injectable()
export class MedicalProgressionService {
  constructor(
    @InjectRepository(MedicalProgression)
    private medicalProgressionRepository: Repository<MedicalProgression>,
    private medicalRecordService: MedicalRecordsService
  ) {}

  async create(
    createMedicalProgressionDto: CreateMedicalProgressionDto,
    record: number
  ): Promise<MedicalProgression> {
    const medicalRecord = await this.medicalRecordService.findOne({
      id: record,
    });

    if (!medicalRecord || !medicalRecord.active)
      throw new UnauthorizedException("Medical record not found or not active");

    const medicalProgression = this.medicalProgressionRepository.create(
      createMedicalProgressionDto
    );
    medicalProgression.medicalRecord = medicalRecord;
    return await this.medicalProgressionRepository.save(medicalProgression);
  }

  findAll(): Promise<MedicalProgression[]> {
    return this.medicalProgressionRepository.find();
  }

  findOne(id: number): Promise<MedicalProgression | null> {
    return this.medicalProgressionRepository.findOne({ where: { id } });
  }

  update(id: number, updateMedicalProgressionDto: UpdateMedicalProgressionDto) {
    return `This action updates a #${id} medicalProgression`;
  }

  async remove(id: number): Promise<void> {
    await this.medicalProgressionRepository.delete(id);
  }
}
