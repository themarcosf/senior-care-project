/** nestjs */
import { PartialType } from "@nestjs/mapped-types";

/** dependencies */
import { CreateMedicalRecordDto } from "./create-medical-record.dto";
//////////////////////////////////////////////////////////////////////////////////////

export class UpdateMedicalRecordDto extends PartialType(
  CreateMedicalRecordDto
) {}
