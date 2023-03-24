/** nestjs */
import { PartialType } from "@nestjs/mapped-types";

/** dependencies */
import { CreateUserDto } from "./create-user.dto";
//////////////////////////////////////////////////////////////////////////////////////

export class UpdateUserDto extends PartialType(CreateUserDto) {}
