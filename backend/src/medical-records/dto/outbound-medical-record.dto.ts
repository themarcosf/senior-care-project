import { Expose } from "class-transformer";
import { MedicalRecord } from "../entities/medical-records.entity";
//////////////////////////////////////////////////////////////////////////////////////

export class OutboundMedicalRecordDto {
  @Expose()
  patientId: number;

  @Expose()
  progressions: string[];

  constructor(partial: Partial<MedicalRecord>) {
    Object.assign(this, partial);
  }
}
