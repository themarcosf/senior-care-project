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
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";

/** providers */
import { MedicalProgressionService } from "./medical-progression.service";

/** dependencies */
import { Api, QueryField } from "./common/common.enum";
import { CreateMedicalProgressionDto } from "./dto/create-medical-progression.dto";
import { UpdateMedicalProgressionDto } from "./dto/update-medical-progression.dto";
////////////////////////////////////////////////////////////////////////////////

@Controller(Api.ADDR)
export class MedicalProgressionController {
  constructor(
    private readonly medicalProgressionService: MedicalProgressionService
  ) {}

  // TODO : implement multiple file upload
  @UseInterceptors(FileInterceptor("medicalTests"))
  @Post()
  create(
    @Query(QueryField.MEDICAL_RECORD) medicalRecordId: number,
    @Body() createMedicalProgressionDto: CreateMedicalProgressionDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    if (file) createMedicalProgressionDto.medicalTests = [file.filename];
    return this.medicalProgressionService.create(
      createMedicalProgressionDto,
      medicalRecordId
    );
  }

  @Get()
  findAll() {
    return this.medicalProgressionService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: number) {
    return this.medicalProgressionService.findOne(id);
  }

  @Patch(":id")
  update(
    @Param("id") id: number,
    @Body() updateMedicalProgressionDto: UpdateMedicalProgressionDto
  ) {
    return this.medicalProgressionService.update(
      id,
      updateMedicalProgressionDto
    );
  }

  @Delete(":id")
  remove(@Param("id") id: number) {
    return this.medicalProgressionService.remove(id);
  }
}
