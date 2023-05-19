/** nestjs */
import { Get, Post, Body, Controller, Req, Query } from "@nestjs/common";

/** providers */
import { Api, QueryField } from "./common/common.enum";
import { PassportRequest } from "../auth/auth.controller";
import { MedicalRecord } from "./entities/medical-records.entity";
import { MedicalRecordsService } from "./medical-records.service";
import { CreateMedicalRecordDto } from "./dto/create-medical-record.dto";
////////////////////////////////////////////////////////////////////////////////

export interface PartialMedicalRecord {
  id: number;
  patientFullName: string;
  lastProgression: string | undefined;
}

@Controller(Api.ADDR)
export class MedicalRecordsController {
  constructor(private readonly medicalRecordsService: MedicalRecordsService) {}

  @Post()
  async create(
    @Req() req: PassportRequest,
    @Body() createMedicalRecordDto: CreateMedicalRecordDto
  ): Promise<MedicalRecord> {
    createMedicalRecordDto.createdByUserId = req.user!.id;
    return await this.medicalRecordsService.create(createMedicalRecordDto);
  }

  @Get()
  findAll(): Promise<PartialMedicalRecord[]> {
    return this.medicalRecordsService.findAll("DESC");
  }

  @Get(Api.PATIENT)
  findOne(
    @Query(QueryField.ID) patientId: number,
    @Query(QueryField.FULL_NAME) patientFullName: string
  ): Promise<MedicalRecord | null> {
    return patientId
      ? this.medicalRecordsService.findOne(patientId, "DESC")
      : this.medicalRecordsService.findOne(patientFullName, "DESC");
  }

  @Get(QueryField.TOGGLE_STATUS)
  toggleStatus(@Query(QueryField.ID) id: number) {
    return this.medicalRecordsService.toggleStatus(id);
  }
}
