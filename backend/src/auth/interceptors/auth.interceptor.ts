/**
 * @fileoverview Interceptor for the auth module
 *
 * Interceptors are
 * - ExecutionContext specific
 * - RxJS based, so they can be used with Observables
 * - Observable based, so they can be used with async/await
 * - used to response and exception mapping, stream overriding, handle timeouts, caching
 */

/** nestjs */
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";

/** dependencies */
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
//////////////////////////////////////////////////////////////////////////////////////

@Injectable()
export class AuthInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log("Request@AuthInterceptor.before");

    const now = Date.now();

    return next
      .handle()
      .pipe(
        tap(() =>
          console.log(`Response@AuthInterceptor.after ${Date.now() - now} ms`)
        )
      );
  }
}
