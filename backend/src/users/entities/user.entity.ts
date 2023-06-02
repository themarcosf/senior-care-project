import { Exclude } from "class-transformer";
import { Column, Entity, Index, OneToMany } from "typeorm";
import { BaseEntity } from "../../common/base-entity/base.entity";
import { MedicalRecord } from "../../medical-records/entities/medical-records.entity";
import { ProgressionType } from "../../progression-type/entities/progression-type.entity";
import { MedicalProgression } from "../../medical-progression/entities/medical-progression.entity";
////////////////////////////////////////////////////////////////////////////////

@Entity()
export class User extends BaseEntity {
  @Column()
  name: string;

  @Column()
  @Index({ unique: true })
  email: string;

  @Exclude()
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

  /** constructor */
  constructor(partial: Partial<User>) {
    super("user");
    Object.assign(this, partial);
  }
}
