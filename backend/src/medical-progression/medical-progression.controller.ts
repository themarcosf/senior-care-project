/** nestjs */
import {
  Get,
  Req,
  Post,
  Body,
  Patch,
  Param,
  Query,
  Controller,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";

/** providers */
import { MedicalProgressionService } from "./medical-progression.service";

/** dependencies */
import { PassportRequest } from "../auth/auth.controller";
import { Api, QueryField, ParamField } from "./common/common.enum";
import { MedicalProgression } from "./entities/medical-progression.entity";
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
    @Req() req: PassportRequest,
    @Query(QueryField.MEDICAL_RECORD) medicalRecordId: number,
    @Query(QueryField.PROGRESSION_TYPE) progressionType: number,
    @Body() createMedicalProgressionDto: CreateMedicalProgressionDto,
    @UploadedFile() file: Express.Multer.File
  ): Promise<MedicalProgression> {
    if (file) createMedicalProgressionDto.medicalTests = [file.filename];

    return this.medicalProgressionService.create(
      createMedicalProgressionDto,
      medicalRecordId,
      req.user!,
      progressionType
    );
  }

  @Get()
  findAll(): Promise<MedicalProgression[]> {
    return this.medicalProgressionService.findAll();
  }

  @Get(Api.ID)
  findOne(
    @Param(ParamField.ID) id: number
  ): Promise<MedicalProgression | null> {
    return this.medicalProgressionService.findOne(id);
  }

  @Patch(Api.ID)
  update(
    @Param(ParamField.ID) id: number,
    @Body() updateMedicalProgressionDto: UpdateMedicalProgressionDto
  ): Promise<MedicalProgression | null> {
    return this.medicalProgressionService.update(
      id,
      updateMedicalProgressionDto
    );
  }
}
