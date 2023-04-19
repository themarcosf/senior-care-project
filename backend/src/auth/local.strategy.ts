/** nestjs */

import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";

/** providers */
import { AuthService } from "./auth.service";

/** dependencies */
import { Strategy } from "passport-local";

import { User } from "../users/entities/user.entity";
import { ExceptionMessages } from "../common/common.enum";
////////////////////////////////////////////////////////////////////////////////

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: "email" });
  }

  async validate(email: string, pass: string): Promise<User> {
    const user = await this.authService.validateUser(email, pass);

    if (!user)
      throw new UnauthorizedException(ExceptionMessages.USER_NOT_FOUND);

    return user;
  }
}
