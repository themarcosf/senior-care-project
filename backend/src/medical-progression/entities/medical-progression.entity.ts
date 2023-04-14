import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

// import { CreateMedicalProgressionDto } from "../dto/create-medical-progression.dto";

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

  // constructor(createMedicalProgressionDto: CreateMedicalProgressionDto) {
  //   this.diagnosis = createMedicalProgressionDto.diagnosis;
  //   this.physicians = createMedicalProgressionDto.physicians;
  //   this.nurses = createMedicalProgressionDto.nurses;
  //   this.medicalTests = createMedicalProgressionDto.medicalTests;
  // }
}
