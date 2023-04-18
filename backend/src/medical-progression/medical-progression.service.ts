/** nestjs */
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

/** dependencies */
import { Repository } from "typeorm";
import { MedicalProgression } from "./entities/medical-progression.entity";
import { CreateMedicalProgressionDto } from "./dto/create-medical-progression.dto";
import { UpdateMedicalProgressionDto } from "./dto/update-medical-progression.dto";
////////////////////////////////////////////////////////////////////////////////

@Injectable()
export class MedicalProgressionService {
  constructor(
    @InjectRepository(MedicalProgression)
    private medicalProgressionRepository: Repository<MedicalProgression>
  ) {}

  // TODO : implement QueryRunner
  async create(
    createMedicalProgressionDto: CreateMedicalProgressionDto
  ): Promise<MedicalProgression> {
    const medicalProgression = this.medicalProgressionRepository.create(
      createMedicalProgressionDto
    );
    await this.medicalProgressionRepository.save(medicalProgression);
    return medicalProgression;
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
