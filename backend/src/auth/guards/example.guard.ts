/**
 * @fileoverview Auth Guard
 *
 * Guards are executed after all middleware, but before any interceptor or pipe.
 */

/** nestjs */
import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";

/** dependencies */
import { Observable } from "rxjs";
////////////////////////////////////////////////////////////////////////////////

@Injectable()
export class ExampleAuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    console.log("Request@AuthGuard: ", request.method, request.url, "");
    return this.validateRequest(request);
  }

  validateRequest(request: any): boolean {
    return true;
  }
}
