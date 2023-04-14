import { PartialType } from "@nestjs/mapped-types";
import { CreateMedicalProgressionDto } from "./create-medical-progression.dto";
////////////////////////////////////////////////////////////////////////////////

export class UpdateMedicalProgressionDto extends PartialType(
  CreateMedicalProgressionDto
) {}
