/**
 * @fileoverview User Entity
 */
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  AfterInsert,
  AfterUpdate,
  AfterRemove,
} from "typeorm";
////////////////////////////////////////////////////////////////////////////////

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  function: string;

  @Column()
  department: string;

  @Column({ unique: true })
  photo: string;

  @Column({ unique: true })
  thumbprint: string;

  @Column()
  password: string;

  @Column({ default: "user" })
  role: string;

  @Column({ default: true })
  active: boolean;

  @Column({ default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  /** hooks */
  @AfterInsert()
  logInsert() {
    console.log("@HOOK = Inserted user with id", this.id);
  }

  @AfterUpdate()
  logUpdate() {
    console.log("@HOOK = Updated user with id", this.id);
  }

  @AfterRemove()
  logRemove() {
    console.log("@HOOK = Removed user with id", this.id);
  }

  // "cpf": ,
  // "rg": ,
  // "birthDate": ,
  // "sex": ,
  // "phone": ,
  // "cellphone": ,
  // "address": ,
  // "number": ,
  // "complement": ,
  // "neighborhood": ,
  // "city": ,
  // "state": ,
  // "zipCode": ,
  // "registration": ,
  // "digitalSignature": ,
  // "writtenSignature": ,
  // "updatedAt": ,
  // "deletedAt": ,
  // "lastAccessAt": ,
}
