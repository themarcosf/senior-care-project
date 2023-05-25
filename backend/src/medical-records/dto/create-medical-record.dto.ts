import {
  IsString,
  Validate,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  MaxLength,
  IsEmpty,
  IsEmail,
} from "class-validator";
import { isValid } from "date-fns";
//////////////////////////////////////////////////////////////////////////////////////

export class CreateMedicalRecordDto {
  @IsString()
  @IsNotEmpty()
  patientFullName: string;

  @Validate((value: Date) => isValid(value))
  birthDate: Date;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  nationalId: string;

  // ICD = International Classification of Diseases
  // ICD API: https://icd.who.int/icdapi
  @IsString()
  icdCode: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  icdDescription: string;

  @IsOptional()
  @IsString()
  legalGuardian: string;

  // national id number of the legal guardian
  @IsOptional()
  @IsString()
  legalGuardianIdNumber: string;

  @IsOptional()
  @IsPhoneNumber("BR")
  legalGuardianPhone: string;

  @IsOptional()
  @IsString()
  insurancePlan: string;

  @IsOptional()
  @IsString()
  insurancePolicyNumber: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  observation: string;

  @IsEmpty()
  createdByUserId: number;
}
