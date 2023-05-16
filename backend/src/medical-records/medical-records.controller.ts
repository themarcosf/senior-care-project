/** nestjs */
import { Get, Post, Body, Controller, Req, Query } from "@nestjs/common";

/** providers */
import { Api } from "./common/common.enum";
import { User } from "../users/entities/user.entity";
import { MedicalRecord } from "./entities/medical-records.entity";
import { MedicalRecordsService } from "./medical-records.service";
import { CreateMedicalRecordDto } from "./dto/create-medical-record.dto";
////////////////////////////////////////////////////////////////////////////////

interface Request extends Express.Request {
  user: User;
}

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
    @Req() req: Request,
    @Body() createMedicalRecordDto: CreateMedicalRecordDto
  ): Promise<MedicalRecord> {
    createMedicalRecordDto.createdByUserId = req.user.id;
    return await this.medicalRecordsService.create(createMedicalRecordDto);
  }

  @Get()
  findAll(): Promise<PartialMedicalRecord[]> {
    return this.medicalRecordsService.findAll("DESC");
  }

  @Get(Api.PATIENT)
  findOne(
    @Query(Api.QUERY_ID) patientId: number,
    @Query(Api.QUERY_FULL_NAME) patientFullName: string
  ): Promise<MedicalRecord | null> {
    return patientId
      ? this.medicalRecordsService.findOne(patientId, "DESC")
      : this.medicalRecordsService.findOne(patientFullName, "DESC");
  }
}
