/** nestjs */
import { Injectable } from "@nestjs/common";

/** dependencies */
import { DataSource, QueryRunner } from "typeorm";

import { User } from "../../users/entities/user.entity";
import { QueryRunnerInterface } from "./query-runner.interface";
import { MedicalRecord } from "../../medical-records/entities/medical-records.entity";
import { ProgressionType } from "../../progression-type/entities/progression-type.entity";
import { MedicalProgression } from "../../medical-progression/entities/medical-progression.entity";
////////////////////////////////////////////////////////////////////////////////

/**
 * QueryRunnerFactory
 *
 * @description QueryRunnerFactory is implemented as a helper class to enable
 * testing without mocking the entire DataSource object (which exposes several methods).
 * @implements {QueryRunnerInterface} with a limited set of methods required to
 * maintain transactions, making testing more straightforward.
 *
 * @see https://docs.nestjs.com/techniques/database#typeorm-transactions
 */

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
    obj: User | ProgressionType | MedicalRecord | MedicalProgression
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
