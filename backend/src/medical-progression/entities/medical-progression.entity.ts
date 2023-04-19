import {
  Entity,
  Column,
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

  @ManyToOne(() => MedicalRecord, (medicalRecord) => medicalRecord.progressions)
  medicalRecord: MedicalRecord;

  @Column({ default: () => "CURRENT_TIMESTAMP" })
  date: Date;

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
