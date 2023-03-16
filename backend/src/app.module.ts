/** nestjs */
import { Module } from "@nestjs/common";

/** modules */
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
////////////////////////////////////////////////////////////////////////////////

@Module({
  imports: [UsersModule, AuthModule],
})
export class AppModule {}
