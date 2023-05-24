/** nestjs */
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

/** dependencies */
import { Repository } from "typeorm";

import { User } from "./entities/user.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { QueryRunnerFactory } from "../common/query-runner/query-runner.factory";
////////////////////////////////////////////////////////////////////////////////

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
    private readonly queryRunner: QueryRunnerFactory
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    // check if email already exists
    if (await this.findOne({ email: createUserDto.email })) {
      throw new UnauthorizedException("Email already exists");
    }

    // create a query runner
    await this.queryRunner.connect();
    await this.queryRunner.startTransaction();

    // try to save user
    try {
      const user = this.repository.create(createUserDto);
      await this.queryRunner.commitTransaction(user);
      return user;
    } catch (err) {
      // rollback changes made in case of error
      await this.queryRunner.rollbackTransaction();
      throw err;
    } finally {
      // release queryRunner after transaction
      await this.queryRunner.release();
    }
  }

  async findAll(): Promise<User[]> {
    // create queryBuilder
    const queryBuilder = this.repository.createQueryBuilder("user");

    // execute queryBuilder and return results
    return queryBuilder.getMany();
  }

  async findOne(criteria: {
    id?: number;
    email?: string;
  }): Promise<User | null> {
    // create queryBuilder with criteria
    const queryBuilder = this.repository.createQueryBuilder("user");
    if (criteria.id) queryBuilder.where("user.id = :id", { id: criteria.id });
    if (criteria.email)
      queryBuilder.where("user.email = :email", { email: criteria.email });

    // execute queryBuilder and return results
    return queryBuilder.getOne();
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    // TODO: password update should be handled differently
    return "// TODO: implement update method";
  }

  remove(id: number) {
    return "// TODO: implement remove method";
  }
}
