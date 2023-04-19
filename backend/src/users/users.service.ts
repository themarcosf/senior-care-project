/** nestjs */
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

/** dependencies */
import { Repository } from "typeorm";

import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { User } from "./entities/user.entity";
////////////////////////////////////////////////////////////////////////////////

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private repository: Repository<User>
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    if (await this.findOne({ email: createUserDto.email })) {
      throw new UnauthorizedException("Email already exists");
    }

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
