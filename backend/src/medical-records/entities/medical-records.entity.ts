import {
  Column,
  Entity,
  AfterInsert,
  AfterUpdate,
  AfterRemove,
  PrimaryGeneratedColumn,
  OneToMany,
} from "typeorm";
import { MedicalProgression } from "../../medical-progression/entities/medical-progression.entity";
////////////////////////////////////////////////////////////////////////////////

@Entity()
export class MedicalRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  patientId: number;

  @OneToMany(
    () => MedicalProgression,
    (progression) => progression.medicalRecord
  )
  progressions: MedicalProgression[];

  @Column({ default: true })
  active: boolean;

  @Column({ default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  /** hooks */
  @AfterInsert()
  logInsert() {
    console.log("@HOOK = Inserted medical record with id", this.id);
  }

  @AfterUpdate()
  logUpdate() {
    console.log("@HOOK = Updated medical record with id", this.id);
  }

  @AfterRemove()
  logRemove() {
    console.log("@HOOK = Removed medical record with id", this.id);
  }
}
