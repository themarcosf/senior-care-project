/** nestjs */
import { Module, Global } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

/** providers */
import { UsersService } from "./users.service";
import { User } from "./entities/user.entity";
import { Physician } from "./entities/physician.entity";
import { PracticalNurse } from "./entities/practicalNurse.entity";
////////////////////////////////////////////////////////////////////////////////

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([User, Physician, PracticalNurse])],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
