/** nestjs */
import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from "@nestjs/common";

/** providers */
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { AuthMiddleware } from "./middleware/auth.middleware";
////////////////////////////////////////////////////////////////////////////////

@Module({
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware) // : eg cors(), helmet(), morgan(), etc
      .exclude({ path: "/api/v1/auth/*", method: RequestMethod.DELETE }) // : string[] | RouteInfo | Regex (npm path-to-regexp)
      .forRoutes({ path: "/api/v1/auth/*", method: RequestMethod.ALL }); // : string[] | RouteInfo[] | *Controller[]
  }
}
