/** nestjs */
import { Module, Global } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

/** providers */
import { UsersService } from "./users.service";
import { User } from "./entities/user.entity";
import { QueryRunnerFactory } from "../common/query-runner/query-runner.factory";
////////////////////////////////////////////////////////////////////////////////

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService, QueryRunnerFactory],
  exports: [UsersService],
})
export class UsersModule {}
