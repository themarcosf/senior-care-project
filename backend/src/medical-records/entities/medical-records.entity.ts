import {
  Column,
  Entity,
  Relation,
  OneToMany,
  JoinColumn,
  AfterInsert,
  AfterUpdate,
  AfterRemove,
  PrimaryGeneratedColumn,
} from "typeorm";
import { MedicalProgression } from "../../medical-progression/entities/medical-progression.entity";
////////////////////////////////////////////////////////////////////////////////

@Entity()
export class MedicalRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  patientId: number;

  @Column({ default: true })
  active: boolean;

  @Column({ default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  /** relations */
  @OneToMany(
    () => MedicalProgression,
    (progression) => progression.medicalRecord
  )
  @JoinColumn()
  progressions: Relation<MedicalProgression[]>;

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
