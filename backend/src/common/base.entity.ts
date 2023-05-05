import {
  AfterInsert,
  AfterUpdate,
  AfterRemove,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  VersionColumn,
} from "typeorm";
////////////////////////////////////////////////////////////////////////////////

export abstract class BaseEntity {
  constructor(private entityName: string) {}

  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: null | Date;

  @VersionColumn()
  version: number;

  /** hooks */
  @AfterInsert()
  logInsert() {
    console.log(`@HOOK = Inserted ${this.entityName} with id`, this.id);
  }

  @AfterUpdate()
  logUpdate() {
    console.log(`@HOOK = Updated ${this.entityName} with id`, this.id);
  }

  @AfterRemove()
  logRemove() {
    console.log(`@HOOK = Removed ${this.entityName} with id`, this.id);
  }
}
