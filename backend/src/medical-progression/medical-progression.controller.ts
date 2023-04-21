/** nestjs */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from "@nestjs/common";

/** providers */
import { MedicalProgressionService } from "./medical-progression.service";

/** dependencies */
import { CreateMedicalProgressionDto } from "./dto/create-medical-progression.dto";
import { UpdateMedicalProgressionDto } from "./dto/update-medical-progression.dto";
import { Api, QueryField } from "./common/common.enum";
////////////////////////////////////////////////////////////////////////////////

@Controller(Api.ADDR)
export class MedicalProgressionController {
  constructor(
    private readonly medicalProgressionService: MedicalProgressionService
  ) {}

  @Post()
  create(
    @Query(QueryField.MEDICAL_RECORD) medicalRecordId: string,
    @Body() createMedicalProgressionDto: CreateMedicalProgressionDto
  ) {
    return this.medicalProgressionService.create(
      createMedicalProgressionDto,
      +medicalRecordId
    );
  }

  @Get()
  findAll() {
    return this.medicalProgressionService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.medicalProgressionService.findOne(+id);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateMedicalProgressionDto: UpdateMedicalProgressionDto
  ) {
    return this.medicalProgressionService.update(
      +id,
      updateMedicalProgressionDto
    );
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.medicalProgressionService.remove(+id);
  }
}
