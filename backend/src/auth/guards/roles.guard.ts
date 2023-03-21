/**
 * @fileoverview Roles Guard
 *
 * guards are executed after all middleware, but before any interceptor or pipe
 * this guard is used to protect routes from unauthorized access by users with insufficient permissions
 */

/** nestjs */
import { Reflector } from "@nestjs/core";
import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";

/** dependencies */
import { Observable } from "rxjs";
////////////////////////////////////////////////////////////////////////////////

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get<string[]>("roles", context.getHandler());
    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    return this.matchRoles(roles, user.roles);
  }

  matchRoles(roles: string[], userRoles: string[]): boolean {
    return roles.some((role) => userRoles.includes(role));
  }
}
