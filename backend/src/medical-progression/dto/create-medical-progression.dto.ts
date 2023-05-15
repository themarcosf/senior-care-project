import { IsOptional, IsString } from "class-validator";
//////////////////////////////////////////////////////////////////////////////////////

export class CreateMedicalProgressionDto {
  @IsString()
  diagnosis: string;

  @IsString()
  physicians: string;

  @IsString()
  nurses: string;

  @IsOptional()
  @IsString({ each: true })
  medicalTests: string[];
}
