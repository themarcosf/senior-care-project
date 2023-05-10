import { Column, Entity, Index } from "typeorm";
import { IsEmail, IsNotEmpty } from "class-validator";
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
  @IsEmail()
  email: string;

  @Column()
  @IsNotEmpty()
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
