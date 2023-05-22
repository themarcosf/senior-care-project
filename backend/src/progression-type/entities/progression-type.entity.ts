import { Column, Entity, OneToMany } from "typeorm";

import { BaseEntity } from "../../common/base.entity";
import { MedicalProgression } from "../../medical-progression/entities/medical-progression.entity";
////////////////////////////////////////////////////////////////////////////////

@Entity()
export class ProgressionType extends BaseEntity {
  constructor() {
    super("progression type");
  }

  /** columns */
  @Column()
  description: string;

  @Column({ default: false })
  toggleStatus: boolean;

  @Column()
  createdByUserId: number;

  @Column({ default: true })
  isActive: boolean;

  /** relations */
  @OneToMany(
    () => MedicalProgression,
    (medicalProgression) => medicalProgression.progressionType
  )
  progressions: Promise<MedicalProgression[]>;
}
