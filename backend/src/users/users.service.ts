/**
 * @fileoverview Service for the users module
 *
 * Services are responsible for:
 * - business logic
 * - data persistence
 * - logging and caching
 */

/** nestjs */
import { Injectable } from "@nestjs/common";

/** dependencies */
import { User } from "./entities/user.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
////////////////////////////////////////////////////////////////////////////////

@Injectable()
export class UsersService {
  private readonly users: User[] = [];

  create(createUserDto: CreateUserDto) {
    const id = this.users.length + 1;
    this.users.push({ ...createUserDto, id } as User);
    return this.users[id - 1];
  }

  findAll(email?: string): User | User[] | undefined {
    return email ? this.users.find((user) => user.email === email) : this.users;
  }

  findOne(id: number) {
    return this.users[id - 1];
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return "// TODO: implement update method";
  }

  remove(id: number) {
    return this.users.splice(id - 1, 1);
  }
}
