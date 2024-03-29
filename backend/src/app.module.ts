/** nestjs */
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

/** modules */
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { MedicalRecordsModule } from "./medical-records/medical-records.module";
import { MedicalProgressionModule } from "./medical-progression/medical-progression.module";
import { ProgressionTypeModule } from "./progression-type/progression-type.module";
////////////////////////////////////////////////////////////////////////////////

@Module({
  imports: [
    UsersModule,
    AuthModule,
    MedicalRecordsModule,
    MedicalProgressionModule,
    ProgressionTypeModule,
    /** runtime environment variables (e.g. OS shell exports) take precedence */
    // TODO : schema validation (see https://docs.nestjs.com/techniques/configuration#schema-validation)
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      ignoreEnvFile: process.env.NODE_ENV === "prod" ? true : false,
    }),
    /** see https://typeorm.io/data-source-options */
    TypeOrmModule.forRoot({
      type: "sqlite",
      database: "db.sqlite",
      autoLoadEntities: true,
      cache: {
        duration: 30000, // 30 seconds
      },
      synchronize: process.env.NODE_ENV === "prod" ? false : true,
    }),
  ],
})
export class AppModule {}
