/**
 * @fileoverview Outbound User DTO
 * used to serialize the User entity
 */
import { Expose, Exclude } from "class-transformer";
import { User } from "./../../users/entities/user.entity";
//////////////////////////////////////////////////////////////////////////////////////

export class OutboundUserDto {
  @Expose()
  get firstName(): string {
    return this.name?.split(" ")[0];
  }

  @Exclude()
  name: string;

  @Exclude()
  email: string;

  @Exclude()
  password: string;

  @Exclude()
  role: string;

  @Exclude()
  id: number;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
