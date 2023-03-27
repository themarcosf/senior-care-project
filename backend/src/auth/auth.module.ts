/**
 * WARNING :
 * All authentication is done using Passport module, as recommended by
 * NestJS documentation including JWT generation and validation
 * https://docs.nestjs.com/techniques/authentication
 * https://github.com/auth0/node-jsonwebtoken#usage
 * https://github.com/nestjs/jwt/blob/master/README.md
 */

/** nestjs */
import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";

/** providers */
import { AuthService } from "./auth.service";
import { LocalStrategy } from "./auth.strategy";
import { AuthController } from "./auth.controller";
import { AuthMiddleware } from "./middleware/auth.middleware";
import { JwtModule } from "@nestjs/jwt";
import { AuthConstants } from "./auth.constants";
////////////////////////////////////////////////////////////////////////////////

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: "local" }),
    JwtModule.register({
      secret: AuthConstants.JWT_SECRET,
      signOptions: { expiresIn: "1h" },
    }),
  ],
  controllers: [AuthController],
  providers: [LocalStrategy, AuthService],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware) // : eg cors(), helmet(), morgan(), etc
      .exclude({ path: "/api/v1/auth/*", method: RequestMethod.DELETE }) // : string[] | RouteInfo | Regex (npm path-to-regexp)
      .forRoutes({ path: "/api/v1/auth/*", method: RequestMethod.ALL }); // : string[] | RouteInfo[] | *Controller[]
  }
}
