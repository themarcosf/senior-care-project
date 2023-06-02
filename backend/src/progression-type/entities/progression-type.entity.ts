import { Exclude } from "class-transformer";
import { Column, Entity, OneToMany, ManyToOne } from "typeorm";

import { User } from "../../users/entities/user.entity";
import { BaseEntity } from "../../common/base-entity/base.entity";
import { MedicalProgression } from "../../medical-progression/entities/medical-progression.entity";
////////////////////////////////////////////////////////////////////////////////

@Entity()
export class ProgressionType extends BaseEntity {
  @Column()
  description: string;

  @Column({ default: false })
  toggleClinicalStatus: boolean;

  @Exclude()
  @Column({ default: true })
  isActive: boolean;

  /** relations */
  @ManyToOne(() => User, (user) => user.progressionTypes)
  createdBy: Promise<User>;

  @OneToMany(
    () => MedicalProgression,
    (medicalProgression) => medicalProgression.progressionType
  )
  progressions: Promise<MedicalProgression[]>;

  /** constructor */
  constructor() {
    super("progression type");
  }
}
