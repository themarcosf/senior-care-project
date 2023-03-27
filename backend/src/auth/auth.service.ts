/** nestjs */
import { JwtService } from "@nestjs/jwt";
import { Injectable } from "@nestjs/common";

/** providers */
import { UsersService } from "../users/users.service";

/** dependencies */
import { SigninDto } from "./dto/signin.dto";
import { User } from "../users/entities/user.entity";
////////////////////////////////////////////////////////////////////////////////

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService
  ) {}

  validateUser(signinDto: SigninDto): User | null {
    const user = this.usersService.findAll(signinDto.email) as User;
    console.log("jwt: ", this.login(user));
    return user?.password === signinDto.password ? user : null;
  }

  login(user: User) {
    const payload = { email: user.email, sub: user.id };
    return this.jwtService.sign(payload);
  }
}
