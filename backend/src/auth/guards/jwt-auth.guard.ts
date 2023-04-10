/** nestjs */
import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Reflector } from "@nestjs/core";

/** dependencies */

import { ExceptionMessages, Constants } from "../../common/commom.enum";
////////////////////////////////////////////////////////////////////////////////

@Injectable()
export class JwtAuthGuard extends AuthGuard(Constants.Auth.JWT_AUTHGUARD) {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    if (
      this.reflector.getAllAndOverride<boolean>(Constants.Auth.IS_PUBLIC_KEY, [
        context.getHandler(),
        context.getClass(),
      ])
    )
      return true;

    return super.canActivate(context);
  }

  handleRequest(err: any, user: any) {
    if (err || !user)
      throw new UnauthorizedException(ExceptionMessages.USER_NOT_FOUND);

    return user;
  }
}
