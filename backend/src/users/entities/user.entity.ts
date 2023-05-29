import { Column, Entity, Index, OneToMany } from "typeorm";
import { BaseEntity } from "../../common/base-entity/base.entity";
import { ProgressionType } from "../../progression-type/entities/progression-type.entity";
////////////////////////////////////////////////////////////////////////////////

// TODO: add validation
@Entity()
export class User extends BaseEntity {
  constructor() {
    super("user");
  }

  @Column()
  name: string;

  @Column()
  @Index({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  licenseNum: string;

  @Column()
  role: string;

  @Column({ default: true })
  isActive: boolean;

  /** relations */
  @OneToMany(
    () => ProgressionType,
    (progressionType) => progressionType.createdBy
  )
  progressionTypes: Promise<ProgressionType[]>;
}
