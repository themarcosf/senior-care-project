/** nestjs */
import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";

/** dependencies */
import { ExtractJwt, Strategy } from "passport-jwt";

import { User } from "./../users/entities/user.entity";
import { UsersService } from "./../users/users.service";
////////////////////////////////////////////////////////////////////////////////

interface Payload {
  sub: string;
  email: string;
  iat: number;
  exp: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
      ignoreExpiration: false, // TODO : set to true in production
    });
  }

  async validate(payload: Payload): Promise<User> {
    return await (<Promise<User>>(
      this.usersService.findOne({ email: payload.email })
    ));
  }
}
