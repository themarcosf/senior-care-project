import { Column, Entity, ManyToOne, OneToMany } from "typeorm";

import { User } from "../../users/entities/user.entity";
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
  @ManyToOne(() => User, (user) => user.medicalRecords)
  createdBy: Promise<User>;

  @OneToMany(
    () => MedicalProgression,
    (progression) => progression.medicalRecord
  )
  progressions: Promise<MedicalProgression[]>;
}
