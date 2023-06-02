import {
  AfterInsert,
  AfterUpdate,
  AfterRemove,
  VersionColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  BaseEntity as TypeOrmBaseEntity,
} from "typeorm";
import { Exclude } from "class-transformer";
////////////////////////////////////////////////////////////////////////////////

/**
 * Base entity class that includes common fields and hooks
 *
 * @see https://typeorm.io/entity-inheritance
 */
export abstract class BaseEntity extends TypeOrmBaseEntity {
  @Exclude()
  @PrimaryGeneratedColumn()
  id: number;

  @Exclude()
  @CreateDateColumn()
  createdAt: Date;

  @Exclude()
  @UpdateDateColumn()
  updatedAt: Date;

  @Exclude()
  @DeleteDateColumn()
  deletedAt?: Date;

  @Exclude()
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

  constructor(private entityName: string) {
    super();
  }
}
