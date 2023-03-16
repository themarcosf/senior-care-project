/** @fileoverview Users Global Module */

/** nestjs */
import { Module, Global } from "@nestjs/common";

/** providers */
import { UsersService } from "./users.service";
////////////////////////////////////////////////////////////////////////////////

@Global()
@Module({
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
