import {
  IsEmpty,
  IsString,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
} from "class-validator";
//////////////////////////////////////////////////////////////////////////////////////

export class CreateProgressionTypeDto {
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsOptional()
  @IsBoolean()
  toggleStatus: boolean;

  @IsEmpty()
  createdByUserId: number;
}
