import { IsOptional, IsString } from "class-validator";
//////////////////////////////////////////////////////////////////////////////////////

export class CreateMedicalProgressionDto {
  @IsString()
  diagnosis: string;

  @IsOptional()
  @IsString({ each: true })
  medicalTests: string[];
}
