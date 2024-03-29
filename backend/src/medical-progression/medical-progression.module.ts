/** nestjs */
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MulterModule } from "@nestjs/platform-express";

/** controllers */
import { MedicalProgressionController } from "./medical-progression.controller";

/** providers */
import { MedicalProgressionService } from "./medical-progression.service";
import { MedicalRecordsModule } from "../medical-records/medical-records.module";

/** dependencies */
import { MedicalProgression } from "./entities/medical-progression.entity";
import fileValidationOptions from "./common/file-validation.options";
import { ProgressionTypeModule } from "../progression-type/progression-type.module";
////////////////////////////////////////////////////////////////////////////////

@Module({
  imports: [
    MedicalRecordsModule,
    ProgressionTypeModule,
    TypeOrmModule.forFeature([MedicalProgression]),
    MulterModule.register(fileValidationOptions),
  ],
  controllers: [MedicalProgressionController],
  providers: [MedicalProgressionService],
})
export class MedicalProgressionModule {}
