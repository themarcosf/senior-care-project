/**
 * WARNING :
 * All authentication is done using Passport module, as recommended by
 * NestJS documentation, including JWT generation and validation
 * https://docs.nestjs.com/techniques/authentication
 * https://github.com/auth0/node-jsonwebtoken#usage
 * https://github.com/nestjs/jwt/blob/master/README.md
 *
 * TODO : implement Passport strategies end-to-end (jwt & local)
 * OPTION : use AWS Cognito
 */

/** nestjs */
import {
  Module,
  NestModule,
  RequestMethod,
  MiddlewareConsumer,
} from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { APP_GUARD } from "@nestjs/core";
import { PassportModule } from "@nestjs/passport";

/** controllers */
import { AuthController } from "./auth.controller";

/** providers */
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./jwt.strategy";
import { LocalStrategy } from "./local.strategy";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";

/** dependencies */
import { AuthConstants } from "./auth.constants";
import { AuthMiddleware } from "./middleware/auth.middleware";
////////////////////////////////////////////////////////////////////////////////

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: AuthConstants.PASSPORT_STRATEGY,
    }),
    JwtModule.register({
      secret: AuthConstants.JWT_SECRET,
      signOptions: { expiresIn: AuthConstants.JWT_EXPIRESIN },
    }),
  ],
  controllers: [AuthController],
  providers: [
    LocalStrategy,
    JwtStrategy,
    AuthService,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
  ],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware) // : eg cors(), helmet(), morgan(), etc
      .exclude({ path: "/api/v1/auth/*", method: RequestMethod.DELETE }) // : string[] | RouteInfo | Regex (npm path-to-regexp)
      .forRoutes({ path: "/api/v1/auth/*", method: RequestMethod.ALL }); // : string[] | RouteInfo[] | *Controller[]
  }
}
