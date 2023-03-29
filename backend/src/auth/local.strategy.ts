/** nestjs */
import { JwtService } from "@nestjs/jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";

/** providers */
import { AuthService } from "./auth.service";

/** dependencies */
import { Strategy } from "passport-local";

import { SigninDto } from "./dto/signin.dto";
import { User } from "../users/entities/user.entity";
import { ExceptionMessages } from "../common/exceptions/exceptions.commom.enum";
////////////////////////////////////////////////////////////////////////////////

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    private jwtService: JwtService
  ) {
    super({ usernameField: "email" });
  }

  validate(body: SigninDto): [User, string] {
    const user = this.authService.validateUser(body);

    if (!user)
      throw new UnauthorizedException(ExceptionMessages.USER_NOT_FOUND);

    return [user, this.login(user)];
  }

  login(user: User) {
    const payload = { email: user.email, sub: user.id };
    return this.jwtService.sign(payload);
  }
}
