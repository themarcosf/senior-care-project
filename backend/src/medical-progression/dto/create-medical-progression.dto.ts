import { IsString } from "class-validator";
//////////////////////////////////////////////////////////////////////////////////////

export class CreateMedicalProgressionDto {
  @IsString()
  diagnosis: string;

  @IsString()
  physicians: string;

  @IsString()
  nurses: string;

  @IsString()
  medicalTests: string;
}
