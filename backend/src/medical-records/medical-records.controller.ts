/** nestjs */
import { Get, Post, Body, Controller, Param, Query } from "@nestjs/common";

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

  @Get()
  async findAll(@Query("loadRels") loadRels?: boolean) {
    return this.medicalRecordsService.findAll(loadRels);
  }

  @Get(":id")
  async findOne(@Param("id") id: number) {
    return this.medicalRecordsService.findOne(id);
  }
}
