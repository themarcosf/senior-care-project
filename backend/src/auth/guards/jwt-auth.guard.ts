/** nestjs */
import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Reflector } from "@nestjs/core";

/** dependencies */
import { Auth } from "../common/common.enum";
////////////////////////////////////////////////////////////////////////////////

/**
 * JwtAuthGuard
 *
 * @see https://docs.nestjs.com/recipes/passport#extending-guards
 * @see https://docs.nestjs.com/recipes/passport#enable-authentication-globally
 */

@Injectable()
export class JwtAuthGuard extends AuthGuard(Auth.JWT_AUTHGUARD) {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    if (
      this.reflector.getAllAndOverride<boolean>(Auth.IS_PUBLIC_KEY, [
        context.getHandler(),
        context.getClass(),
      ])
    )
      return true;

    return super.canActivate(context);
  }

  handleRequest(err: any, user: any) {
    if (err || !user) throw new UnauthorizedException("User not found");

    return user;
  }
}
