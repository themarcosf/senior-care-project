/** this entity describes a Medical Record, which is a document that contains the medical history of a patient */
export class MedicalRecord {
  /** the id of the medical record */
  id: number;
  /** the id of the patient */
  patientId: number;
  /** the id of the doctor who created the medical record */
  doctorId: number;
  /** the date when the medical record was created */
  date: Date;
  /** the description of the medical record */
  description: string;
}
