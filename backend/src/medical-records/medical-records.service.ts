/** nestjs */
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

/** dependencies */
import { Repository } from "typeorm";

import { MedicalRecord } from "./entities/medical-records.entity";
import { CreateMedicalRecordDto } from "./dto/create-medical-record.dto";
import { UpdateMedicalRecordDto } from "./dto/update-medical-record.dto";
////////////////////////////////////////////////////////////////////////////////

@Injectable()
export class MedicalRecordsService {
  constructor(
    @InjectRepository(MedicalRecord)
    private repository: Repository<MedicalRecord>
  ) {}

  async create(
    createMedicalRecordDto: CreateMedicalRecordDto
  ): Promise<MedicalRecord> {
    const medRecord = this.repository.create(createMedicalRecordDto);
    return await this.repository.save(medRecord);
  }

  async findAll(): Promise<MedicalRecord[]> {
    return await this.repository.find();
  }

  async findOne(criteria: {
    id?: number;
    email?: string;
  }): Promise<MedicalRecord | null> {
    return this.repository.findOne({ where: criteria });
  }

  update(id: number, updateMedicalRecordDto: UpdateMedicalRecordDto) {
    return "// TODO: implement update method";
  }

  remove(id: number) {
    return "// TODO: implement remove method";
  }
}
