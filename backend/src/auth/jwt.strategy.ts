/** nestjs */
import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";

/** dependencies */
import { ExtractJwt, Strategy } from "passport-jwt";
import { Constants } from "./../common/commom.enum";
////////////////////////////////////////////////////////////////////////////////

interface Payload {
  sub: string;
  email: string;
  iat: number;
  exp: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true, // TODO: change to false
      secretOrKey: Constants.Auth.JWT_SECRET,
    });
  }

  async validate(payload: Payload) {
    return { id: payload.sub, email: payload.email };
  }
}
