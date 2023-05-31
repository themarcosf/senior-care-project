import { Column, Entity, Index, OneToMany } from "typeorm";
import { BaseEntity } from "../../common/base-entity/base.entity";
import { ProgressionType } from "../../progression-type/entities/progression-type.entity";
import { MedicalRecord } from "../../medical-records/entities/medical-records.entity";
import { MedicalProgression } from "../../medical-progression/entities/medical-progression.entity";
////////////////////////////////////////////////////////////////////////////////

@Entity()
export class User extends BaseEntity {
  constructor() {
    super("user");
  }

  @Column()
  name: string;

  @Column()
  @Index({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  licenseNum: string;

  @Column()
  role: string;

  @Column({ default: true })
  isActive: boolean;

  /** relations */
  @OneToMany(
    () => MedicalProgression,
    (medicalProgression) => medicalProgression.createdBy
  )
  medicalProgressions: Promise<MedicalProgression[]>;

  @OneToMany(() => MedicalRecord, (medicalRecord) => medicalRecord.createdBy)
  medicalRecords: Promise<MedicalRecord[]>;

  @OneToMany(
    () => ProgressionType,
    (progressionType) => progressionType.createdBy
  )
  progressionTypes: Promise<ProgressionType[]>;
}
