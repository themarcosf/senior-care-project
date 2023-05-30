/** nestjs */
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

/** controllers */
import { MedicalRecordsController } from "./medical-records.controller";

/** providers */
import { MedicalRecord } from "./entities/medical-records.entity";
import { MedicalRecordsService } from "./medical-records.service";
import { QueryRunnerFactory } from "../common/query-runner/query-runner.factory";
////////////////////////////////////////////////////////////////////////////////

@Module({
  imports: [TypeOrmModule.forFeature([MedicalRecord])],
  controllers: [MedicalRecordsController],
  providers: [MedicalRecordsService, QueryRunnerFactory],
  exports: [MedicalRecordsService],
})
export class MedicalRecordsModule {}
