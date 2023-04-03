/** nestjs */
import { Injectable } from "@nestjs/common";

/** providers */
import { UsersService } from "../users/users.service";

/** dependencies */
import { SigninDto } from "./dto/signin.dto";
import { User } from "../users/entities/user.entity";
////////////////////////////////////////////////////////////////////////////////

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  validateUser(signinDto: SigninDto): User | null {
    const user = <User>this.usersService.findAll(signinDto.email);
    return user?.password === signinDto.password ? user : null;
  }
}
