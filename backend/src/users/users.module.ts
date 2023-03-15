/**
 * @fileoverview Users Global Module
 *
 * user module serves as basic container for all components related to users
 */
import { Module, Global } from "@nestjs/common";

import { UsersService } from "./users.service";
////////////////////////////////////////////////////////////////////////////////
@Global()
@Module({
  providers: [UsersService],
})
export class UsersModule {}
