/** @fileoverview Users Global Module */

/** nestjs */
import { OnModuleInit, Module, Global } from "@nestjs/common";

/** providers */
import { UsersService } from "./users.service";
////////////////////////////////////////////////////////////////////////////////

@Global()
@Module({
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule implements OnModuleInit {
  onModuleInit() {
    console.log("UsersModule initialized");
  }
}
