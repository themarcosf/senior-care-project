import { Column, Entity, Index } from "typeorm";
import { BaseEntity } from "../../common/base.entity";
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

  @Column({
    enum: ["practicalNurse", "physician", "admin"],
  })
  role: string;

  @Column({ default: true })
  isActive: boolean;
}
