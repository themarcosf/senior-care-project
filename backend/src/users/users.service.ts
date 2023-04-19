/** nestjs */
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

/** dependencies */
import { Repository } from "typeorm";

import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { User } from "./entities/user.entity";
////////////////////////////////////////////////////////////////////////////////

@Injectable()
export class UsersService {
  private readonly users: Array<User> = [];

  constructor(
    @InjectRepository(User)
    private repository: Repository<User>
  ) {}

  async create(createUserDto: CreateUserDto, role: string): Promise<User> {
    this.users.push(
      Object.assign(createUserDto, { id: this.users.length + 1 }) as User
    );

    const user = this.repository.create(createUserDto);
    return await this.repository.save(user);
  }

  async findAll(): Promise<User[]> {
    return await this.repository.find();
  }

  async findOne(criteria: {
    id?: number;
    email?: string;
  }): Promise<User | null> {
    return this.repository.findOne({ where: criteria });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    // TODO: password update should be handled differently
    return "// TODO: implement update method";
  }

  remove(id: number) {
    return "// TODO: implement remove method";
  }
}
