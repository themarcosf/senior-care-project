import { Entity, Column, ManyToOne } from "typeorm";

import { User } from "../../users/entities/user.entity";
import { BaseEntity } from "../../common/base-entity/base.entity";
import { MedicalRecord } from "../../medical-records/entities/medical-records.entity";
import { ProgressionType } from "../../progression-type/entities/progression-type.entity";
////////////////////////////////////////////////////////////////////////////////

// TODO: add validation
@Entity()
export class MedicalProgression extends BaseEntity {
  constructor() {
    super("medical progression");
  }

  @Column()
  diagnosis: string;

  @Column("simple-array", { nullable: true })
  medicalTests: string[];

  /** relations */
  @ManyToOne(() => User, (user) => user.medicalProgressions)
  createdBy: Promise<User>;

  @ManyToOne(() => MedicalRecord, (medicalRecord) => medicalRecord.progressions)
  medicalRecord: Promise<MedicalRecord>;

  @ManyToOne(
    () => ProgressionType,
    (progressionType) => progressionType.progressions
  )
  progressionType: Promise<ProgressionType>;
}
