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

  @Column({ unique: true })
  nationalId: string;

  @Column()
  icdCode: string;

  @Column({ nullable: true, length: 255 })
  icdDescription: string;

  @Column({ nullable: true })
  legalGuardian: string;

  @Column({ nullable: true })
  legalGuardianIdNumber: string;

  @Column({ nullable: true })
  legalGuardianPhone: string;

  @Column({ nullable: true })
  insurancePlan: string;

  @Column({ nullable: true })
  insurancePolicyNumber: string;

  @Column({ nullable: true, length: 255 })
  observation: string;

  @Column()
  createdByUserId: number;

  @Column({ default: true })
  isActive: boolean;

  /** relations */
  @OneToMany(
    () => MedicalProgression,
    (progression) => progression.medicalRecord
  )
  progressions: Promise<MedicalProgression[]>;
}
