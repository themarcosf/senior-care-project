import { IsString, IsBoolean, IsNotEmpty, IsOptional } from "class-validator";
//////////////////////////////////////////////////////////////////////////////////////

export class CreateProgressionTypeDto {
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsOptional()
  @IsBoolean()
  toggleClinicalStatus: boolean;
}
