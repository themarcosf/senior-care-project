/** nestjs */
import { Post, Body, Controller } from "@nestjs/common";

/** providers */
import { Api } from "./common/common.enum";
import { MedicalRecordsService } from "./medical-records.service";
import { CreateMedicalRecordDto } from "./dto/create-medical-record.dto";
////////////////////////////////////////////////////////////////////////////////

@Controller(Api.ADDR)
export class MedicalRecordsController {
  constructor(private readonly medicalRecordsService: MedicalRecordsService) {}

  @Post()
  async create(@Body() createMedicalRecordDto: CreateMedicalRecordDto) {
    return this.medicalRecordsService.create(createMedicalRecordDto);
  }
}
