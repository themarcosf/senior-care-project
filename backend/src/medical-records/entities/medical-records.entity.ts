import {
  Column,
  Entity,
  AfterInsert,
  AfterUpdate,
  AfterRemove,
  PrimaryGeneratedColumn,
} from "typeorm";
////////////////////////////////////////////////////////////////////////////////

@Entity()
export class MedicalRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  patientId: number;

  @Column({ type: "simple-array", default: "init" })
  progressions: string[];

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
