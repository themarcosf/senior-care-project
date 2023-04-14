/** nestjs */
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

/** controllers */
import { MedicalProgressionController } from "./medical-progression.controller";

/** providers */
import { MedicalProgressionService } from "./medical-progression.service";

/** dependencies */
import { MedicalProgression } from "./entities/medical-progression.entity";
////////////////////////////////////////////////////////////////////////////////

@Module({
  imports: [TypeOrmModule.forFeature([MedicalProgression])],
  controllers: [MedicalProgressionController],
  providers: [MedicalProgressionService],
})
export class MedicalProgressionModule {}
