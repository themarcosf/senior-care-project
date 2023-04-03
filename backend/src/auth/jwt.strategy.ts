/** nestjs */
import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";

/** dependencies */
import { Strategy } from "passport-jwt";
import { AuthConstants } from "./auth.constants";
////////////////////////////////////////////////////////////////////////////////

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: (req: any) => {
        return req.cookies.jwt;
      },
      ignoreExpiration: true, // TODO: change to false
      secretOrKey: AuthConstants.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, email: payload.email };
  }
}
