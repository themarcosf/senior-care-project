/** nestjs */
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

/** dependencies */
import { Repository } from "typeorm";

import { Role } from "./common/common.enum";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { User } from "./entities/user.entity";
import { Physician } from "./entities/physician.entity";
import { PracticalNurse } from "./entities/practicalNurse.entity";
////////////////////////////////////////////////////////////////////////////////

@Injectable()
export class UsersService {
  private readonly users: Array<User> = [];

  constructor(
    @InjectRepository(Physician)
    private physicianRepository: Repository<Physician>,
    @InjectRepository(PracticalNurse)
    private practicalNurseRepository: Repository<PracticalNurse>
  ) {}

  async create(createUserDto: CreateUserDto, role: string) {
    switch (role) {
      case Role.PHYSICIAN:
        const physician = this.physicianRepository.create(createUserDto);
        return await this.physicianRepository.save(physician);
      case Role.PRACTICAL_NURSE:
        const practicalNurse =
          this.practicalNurseRepository.create(createUserDto);
        return await this.practicalNurseRepository.save(practicalNurse);
      default:
        return Role.INVALID_ROLE;
    }
  }

  findAll(email?: string): User | User[] | undefined {
    return email ? this.users.find((user) => user.email === email) : this.users;
  }

  findOne(id: number) {
    return this.users[id - 1];
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    // TODO: password update should be handled differently
    return "// TODO: implement update method";
  }

  remove(id: number) {
    return this.users.splice(id - 1, 1);
  }
}
