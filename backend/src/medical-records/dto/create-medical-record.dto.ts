import {
  IsEmail,
  IsString,
  Validate,
  MaxLength,
  IsOptional,
  IsPhoneNumber,
} from "class-validator";
import { isValid } from "date-fns";
//////////////////////////////////////////////////////////////////////////////////////

export class CreateMedicalRecordDto {
  @IsString()
  patientFullName: string;

  @Validate((value: Date) => isValid(value))
  birthDate: Date;

  @IsEmail()
  email: string;

  @IsString()
  nationalId: string;

  // ICD = International Classification of Diseases
  // ICD API: https://icd.who.int/icdapi
  @IsOptional()
  @IsString()
  icdCode: string;

  @IsString()
  legalGuardian: string;

  @IsString()
  legalGuardianIdNumber: string;

  @IsPhoneNumber("BR")
  legalGuardianPhone: string;

  @IsEmail()
  legalGuardianEmail: string;

  @IsString()
  insurancePlan: string;

  @IsString()
  insurancePolicyNumber: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  observation: string;
}
