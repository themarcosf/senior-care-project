/** nestjs */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";

/** providers */
import { MedicalProgressionService } from "./medical-progression.service";

/** dependencies */
import { CreateMedicalProgressionDto } from "./dto/create-medical-progression.dto";
import { UpdateMedicalProgressionDto } from "./dto/update-medical-progression.dto";
import { Api } from "./common/common.enum";
////////////////////////////////////////////////////////////////////////////////

@Controller(Api.ADDR)
export class MedicalProgressionController {
  constructor(
    private readonly medicalProgressionService: MedicalProgressionService
  ) {}

  @Post()
  create(@Body() createMedicalProgressionDto: CreateMedicalProgressionDto) {
    return this.medicalProgressionService.create(createMedicalProgressionDto);
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
