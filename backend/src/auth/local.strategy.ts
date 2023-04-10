/** nestjs */

import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";

/** providers */
import { AuthService } from "./auth.service";

/** dependencies */
import { Strategy } from "passport-local";

import { User } from "../users/entities/user.entity";
import { ExceptionMessages } from "../common/commom.enum";
////////////////////////////////////////////////////////////////////////////////

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: "email" });
  }

  validate(email: string, pass: string): User {
    const user = this.authService.validateUser(email, pass);

    if (!user)
      throw new UnauthorizedException(ExceptionMessages.USER_NOT_FOUND);

    return user;
  }
}
