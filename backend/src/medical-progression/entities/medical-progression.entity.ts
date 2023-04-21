import {
  Entity,
  Column,
  Relation,
  ManyToOne,
  AfterInsert,
  AfterUpdate,
  AfterRemove,
  PrimaryGeneratedColumn,
} from "typeorm";
import { MedicalRecord } from "../../medical-records/entities/medical-records.entity";
////////////////////////////////////////////////////////////////////////////////

@Entity()
export class MedicalProgression {
  @PrimaryGeneratedColumn()
  id: number;

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

  @Column({ default: () => "CURRENT_TIMESTAMP" })
  date: Date;

  /** relations */
  @ManyToOne(() => MedicalRecord, (medicalRecord) => medicalRecord.progressions)
  medicalRecord: Relation<MedicalRecord>;

  /** hooks */
  @AfterInsert()
  logInsert() {
    console.log("@HOOK = Inserted medical progression with id", this.id);
  }

  @AfterUpdate()
  logUpdate() {
    console.log("@HOOK = Updated medical progression with id", this.id);
  }

  @AfterRemove()
  logRemove() {
    console.log("@HOOK = Removed medical progression with id", this.id);
  }
}
