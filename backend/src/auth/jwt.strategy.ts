/** nestjs */
import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";

/** dependencies */
import { Strategy } from "passport-jwt";
import { Constants } from "./enums/constants.enum";
////////////////////////////////////////////////////////////////////////////////

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: (req: any) => {
        return req.cookies
          ? req.cookies.jwt
          : req.headers.authorization.split(" ")[1].split("=")[1];
      },
      ignoreExpiration: true, // TODO: change to false
      secretOrKey: Constants.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, email: payload.email };
  }
}
