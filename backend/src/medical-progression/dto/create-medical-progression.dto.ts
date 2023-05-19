import { IsOptional, IsString } from "class-validator";
//////////////////////////////////////////////////////////////////////////////////////

export class CreateMedicalProgressionDto {
  @IsString()
  diagnosis: string;

  @IsString()
  professional: string;

  @IsOptional()
  @IsString({ each: true })
  medicalTests: string[];
}
