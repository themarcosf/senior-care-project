/** nestjs */
import { Module } from "@nestjs/common";

/** modules */
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { ConfigModule } from "./config/config.module";
////////////////////////////////////////////////////////////////////////////////

@Module({
  imports: [
    UsersModule,
    AuthModule,
    ConfigModule.register({ folder: "./config" }),
  ],
})
export class AppModule {}
