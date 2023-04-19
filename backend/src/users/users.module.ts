/** nestjs */
import { Module, Global } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

/** providers */
import { UsersService } from "./users.service";
import { User } from "./entities/user.entity";
////////////////////////////////////////////////////////////////////////////////

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
