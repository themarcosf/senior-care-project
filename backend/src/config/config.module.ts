/** @fileoverview Dynamic Configuration Module */

/** nestjs */
import { DynamicModule, Module } from "@nestjs/common";

/** providers */
import { ConfigService } from "./config.service";
////////////////////////////////////////////////////////////////////////////////

@Module({})
export class ConfigModule {
  static register(options: Record<string, any>): DynamicModule {
    return {
      module: ConfigModule,
      providers: [
        ConfigService,
        { provide: "CONFIG_OPTIONS", useValue: options },
      ],
      exports: [ConfigService],
    };
  }
}
