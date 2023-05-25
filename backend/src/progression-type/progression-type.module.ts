/** nestjs */
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

/** controllers */
import { ProgressionTypeController } from "./progression-type.controller";

/** providers */
import { ProgressionTypeService } from "./progression-type.service";
import { ProgressionType } from "./entities/progression-type.entity";
import { QueryRunnerFactory } from "../common/query-runner/query-runner.factory";
////////////////////////////////////////////////////////////////////////////////

@Module({
  imports: [TypeOrmModule.forFeature([ProgressionType])],
  controllers: [ProgressionTypeController],
  providers: [ProgressionTypeService, QueryRunnerFactory],
  exports: [ProgressionTypeService],
})
export class ProgressionTypeModule {}
