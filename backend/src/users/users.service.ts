/** nestjs */
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

/** dependencies */
import { Repository, DataSource } from "typeorm";

import { User } from "./entities/user.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
////////////////////////////////////////////////////////////////////////////////

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private repository: Repository<User>,
    private dataSource: DataSource
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    // check if email already exists
    if (await this.findOne({ email: createUserDto.email })) {
      throw new UnauthorizedException("Email already exists");
    }

    // create a query runner
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    // try to save user
    try {
      const user = this.repository.create(createUserDto);
      await queryRunner.manager.save(user);
      await queryRunner.commitTransaction();
      return user;
    } catch (err) {
      // rollback changes made in case of error
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      // release queryRunner after transaction
      await queryRunner.release();
    }
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
