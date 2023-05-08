import { Column, Entity, OneToMany } from "typeorm";

import { BaseEntity } from "../../common/base.entity";
import { MedicalProgression } from "../../medical-progression/entities/medical-progression.entity";
////////////////////////////////////////////////////////////////////////////////

@Entity()
export class MedicalRecord extends BaseEntity {
  constructor() {
    super("medical record");
  }

  @Column()
  patientId: number;

  @Column({ default: true })
  isActive: boolean;

  /** relations */
  @OneToMany(
    () => MedicalProgression,
    (progression) => progression.medicalRecord
  )
  progressions: Promise<MedicalProgression[]>;
}
