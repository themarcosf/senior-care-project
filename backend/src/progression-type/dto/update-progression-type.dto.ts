import { PartialType } from "@nestjs/mapped-types";
import { CreateProgressionTypeDto } from "./create-progression-type.dto";
//////////////////////////////////////////////////////////////////////////////////////

export class UpdateProgressionTypeDto extends PartialType(
  CreateProgressionTypeDto
) {}
