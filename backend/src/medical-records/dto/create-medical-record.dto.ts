import { IsString, IsNumber, IsOptional } from "class-validator";
//////////////////////////////////////////////////////////////////////////////////////

export class CreateMedicalRecordDto {
  @IsNumber()
  patientId: number;

  @IsOptional()
  @IsString()
  progression: string;
}
