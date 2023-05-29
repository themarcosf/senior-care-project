import { Column, Entity, OneToMany } from "typeorm";

import { BaseEntity } from "../../common/base-entity/base.entity";
import { MedicalProgression } from "../../medical-progression/entities/medical-progression.entity";
////////////////////////////////////////////////////////////////////////////////

@Entity()
export class MedicalRecord extends BaseEntity {
  constructor() {
    super("medical record");
  }

  /** columns */
  @Column()
  patientFullName: string;

  @Column()
  birthDate: Date;

  @Column()
  email: string;

  @Column({ unique: true })
  nationalId: string;

  @Column({ nullable: true })
  icdCode: string;

  @Column()
  legalGuardian: string;

  @Column()
  legalGuardianIdNumber: string;

  @Column()
  legalGuardianPhone: string;

  @Column()
  legalGuardianEmail: string;

  @Column()
  insurancePlan: string;

  @Column()
  insurancePolicyNumber: string;

  @Column({ nullable: true, length: 255 })
  observation: string;

  @Column({ default: true })
  isClinicalActive: boolean;

  /** relations */

  @Column()
  createdByUserId: number; // implement foreign key

  @OneToMany(
    () => MedicalProgression,
    (progression) => progression.medicalRecord
  )
  progressions: Promise<MedicalProgression[]>;
}
