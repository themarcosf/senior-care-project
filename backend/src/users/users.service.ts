/**
 * @fileoverview Service for the users module
 *
 * Services are responsible for:
 * - business logic
 * - data persistence
 * - logging and caching
 */
import { Injectable } from "@nestjs/common";

import { User } from "./entities/user.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
////////////////////////////////////////////////////////////////////////////////

@Injectable()
export class UsersService {
  private readonly users: User[] = [];

  create(createUserDto: CreateUserDto) {
    const id = this.users.length + 1;
    this.users.push(Object.assign(new User(), { ...createUserDto, id }));

    return this.users[id - 1];
  }

  findAll() {
    return this.users;
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
