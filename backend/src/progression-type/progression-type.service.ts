/** nestjs */
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

/** dependencies */
import { Repository, DataSource } from "typeorm";
import { ProgressionType } from "./entities/progression-type.entity";
import { CreateProgressionTypeDto } from "./dto/create-progression-type.dto";
////////////////////////////////////////////////////////////////////////////////

@Injectable()
export class ProgressionTypeService {
  constructor(
    @InjectRepository(ProgressionType)
    private repository: Repository<ProgressionType>,
    private dataSource: DataSource
  ) {}

  async create(
    createProgressionTypeDto: CreateProgressionTypeDto
  ): Promise<ProgressionType> {
    // create query runner
    const queryRunner = this.dataSource.createQueryRunner();
    queryRunner.connect();
    queryRunner.startTransaction();

    // try to save progression type
    try {
      const progType = this.repository.create(createProgressionTypeDto);
      await queryRunner.manager.save(progType);
      await queryRunner.commitTransaction();

      // return progression type
      return progType;
    } catch (err) {
      // rollback changes made in case of error
      await queryRunner.rollbackTransaction();
      console.log(err);
      throw new Error("An error ocurred while creating the progression type.");
    } finally {
      // release query runner
      await queryRunner.release();
    }
  }

  async findAll(): Promise<ProgressionType[]> {
    // find all progression types using QueryBuilder
    const progTypes = await this.repository
      .createQueryBuilder("progressionType")
      .getMany();

    // return progression types
    return progTypes;
  }

  async findOne(id: number): Promise<ProgressionType | null> {
    // find progression type using QueryBuilder
    const progType = this.repository
      .createQueryBuilder("progressionType")
      .where("progressionType.id = :id", { id });

    // return progression type
    return await progType.getOne();
  }
}
