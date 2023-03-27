import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";

import { Strategy } from "passport-local";
import { ExceptionMessages } from "../common/exceptions/exceptions.commom.enum";

import { User } from "../users/entities/user.entity";
import { AuthService } from "./auth.service";
import { SigninDto } from "./dto/signin.dto";
////////////////////////////////////////////////////////////////////////////////

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: "email" });
  }

  // called by Passport after request has been authenticated by strategy
  validate(body: SigninDto): User {
    const user = this.authService.validateUser(body);

    if (!user) {
      throw new UnauthorizedException(ExceptionMessages.USER_NOT_FOUND);
    }
    return user;
  }
}
