import {
  AfterInsert,
  AfterUpdate,
  AfterRemove,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  VersionColumn,
  BaseEntity as TypeOrmBaseEntity,
} from "typeorm";
////////////////////////////////////////////////////////////////////////////////

/**
 * Base entity class that includes common fields and hooks
 *
 * @see https://typeorm.io/entity-inheritance
 */
export abstract class BaseEntity extends TypeOrmBaseEntity {
  constructor(private entityName: string) {
    super();
  }

  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

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
