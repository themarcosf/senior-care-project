/**
 * @fileoverview Outbound User DTO
 * used to serialize the User entity
 */

import { Expose, Exclude } from "class-transformer";
import { User } from "../entities/user.entity";
//////////////////////////////////////////////////////////////////////////////////////

export class OutboundUserDto {
  @Expose()
  get firstName(): string {
    return this.name?.split(" ")[0];
  }

  @Exclude()
  id: number;

  @Exclude()
  name: string;

  @Exclude()
  email: string;

  @Exclude()
  password: string;

  @Exclude()
  licenseNum: string;

  @Exclude()
  role: string;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
