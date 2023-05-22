/** nestjs */
import { PartialType } from "@nestjs/mapped-types";

/** dependencies */
import { CreateProgressionTypeDto } from "./create-progression-type.dto";
//////////////////////////////////////////////////////////////////////////////////////

export class UpdateProgressionTypeDto extends PartialType(
  CreateProgressionTypeDto
) {}
