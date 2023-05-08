import { Entity, Column, ManyToOne } from "typeorm";

import { BaseEntity } from "../../common/base.entity";
import { MedicalRecord } from "../../medical-records/entities/medical-records.entity";
////////////////////////////////////////////////////////////////////////////////

@Entity()
export class MedicalProgression extends BaseEntity {
  constructor() {
    super("medical progression");
  }

  @Column()
  diagnosis: string;

  // TODO : add ManyToMany relations with Physicians
  @Column()
  physicians: string;

  // TODO : add ManyToMany relations with Nurses
  @Column()
  nurses: string;

  // TODO : add ManyToOne relations with MedicalTests
  @Column()
  medicalTests: string;

  /** relations */
  @ManyToOne(() => MedicalRecord, (medicalRecord) => medicalRecord.progressions)
  medicalRecord: Promise<MedicalRecord>;
}
