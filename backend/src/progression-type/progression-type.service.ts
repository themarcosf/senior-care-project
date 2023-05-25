/** nestjs */
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

/** dependencies */
import { Repository } from "typeorm";

import { ProgressionType } from "./entities/progression-type.entity";
import { CreateProgressionTypeDto } from "./dto/create-progression-type.dto";
import { QueryRunnerFactory } from "../common/query-runner/query-runner.factory";
////////////////////////////////////////////////////////////////////////////////

@Injectable()
export class ProgressionTypeService {
  constructor(
    @InjectRepository(ProgressionType)
    private readonly repository: Repository<ProgressionType>,
    private readonly queryRunner: QueryRunnerFactory
  ) {}

  async create(
    createProgressionTypeDto: CreateProgressionTypeDto
  ): Promise<ProgressionType> {
    // create query runner
    await this.queryRunner.connect();
    await this.queryRunner.startTransaction();

    // try to save progression type
    try {
      const progType = this.repository.create(createProgressionTypeDto);
      await this.queryRunner.commitTransaction(progType);
      return progType;
    } catch (err) {
      // rollback changes made in case of error
      await this.queryRunner.rollbackTransaction();
      throw new Error("An error ocurred while creating the progression type.");
    } finally {
      // release query runner
      await this.queryRunner.release();
    }
  }

  async findAll(): Promise<ProgressionType[]> {
    return await this.repository
      .createQueryBuilder("progressionType")
      .getMany();
  }

  async findOne(id: number): Promise<ProgressionType | null> {
    return await this.repository
      .createQueryBuilder("progressionType")
      .where("progressionType.id = :id", { id })
      .getOne();
  }
}
