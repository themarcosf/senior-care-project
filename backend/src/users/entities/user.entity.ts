/**
 * IMPORTANT CAVEAT ABOUT TYPEORM METHODS & HOOK DECORATORS
 *
 * save(), remove() : hooks will be executed if called with entity instances
 * insert(), update(), delete() : hooks will NOT be executed
 * @AfterInsert, @AfterUpdate, ...: executed ONLY upon entity instances, NOT upon plain objects
 */
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  AfterInsert,
  AfterUpdate,
  AfterRemove,
} from "typeorm";

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

  @Column({ unique: true })
  password: string;

  @Column()
  active: boolean;
  @Column()
  createdAt: Date;

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
