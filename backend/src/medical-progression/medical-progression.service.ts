/** nestjs */
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

/** dependencies */
import { Repository } from "typeorm";
import { MedicalProgression } from "./entities/medical-progression.entity";
import { MedicalRecord } from "../medical-records/entities/medical-records.entity";
import { CreateMedicalProgressionDto } from "./dto/create-medical-progression.dto";
import { UpdateMedicalProgressionDto } from "./dto/update-medical-progression.dto";
////////////////////////////////////////////////////////////////////////////////

@Injectable()
export class MedicalProgressionService {
  constructor(
    @InjectRepository(MedicalProgression)
    private medicalProgressionRepository: Repository<MedicalProgression>,
    @InjectRepository(MedicalRecord)
    private medicalRecordRepository: Repository<MedicalRecord>
  ) {}

  async create(
    createMedicalProgressionDto: CreateMedicalProgressionDto,
    record: number
  ): Promise<MedicalProgression> {
    const medicalRecord = await this.medicalRecordRepository.findOne({
      where: { id: record },
    });
    if (!medicalRecord)
      throw new UnauthorizedException("Medical record not found");
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
