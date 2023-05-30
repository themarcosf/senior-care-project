/** nestjs */
import { Injectable } from "@nestjs/common";

/** dependencies */
import { DataSource, QueryRunner } from "typeorm";

import { User } from "../../users/entities/user.entity";
import { QueryRunnerInterface } from "./query-runner.interface";
import { ProgressionType } from "../../progression-type/entities/progression-type.entity";
import { MedicalRecord } from "../../medical-records/entities/medical-records.entity";
////////////////////////////////////////////////////////////////////////////////

@Injectable()
export class QueryRunnerFactory implements QueryRunnerInterface {
  private queryRunner: QueryRunner | undefined;

  constructor(private readonly dataSource: DataSource) {}

  async connect(): Promise<void> {
    this.queryRunner = this.dataSource.createQueryRunner();
    await this.queryRunner.connect();
  }

  async startTransaction(): Promise<void> {
    if (!this.queryRunner) {
      throw new Error("QueryRunner not initialized");
    }

    return await this.queryRunner.startTransaction();
  }

  async commitTransaction(
    obj: User | ProgressionType | MedicalRecord
  ): Promise<void> {
    if (!this.queryRunner) throw new Error("QueryRunner not initialized");

    await this.queryRunner.manager.save(obj);
    return await this.queryRunner.commitTransaction();
  }

  async rollbackTransaction(): Promise<void> {
    if (!this.queryRunner) throw new Error("QueryRunner not initialized");

    return await this.queryRunner.rollbackTransaction();
  }

  async release(): Promise<void> {
    if (!this.queryRunner) throw new Error("QueryRunner not initialized");
    return await this.queryRunner.release();
  }
}
