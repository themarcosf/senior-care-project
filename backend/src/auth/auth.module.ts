/**
 * WARNING :
 * All authentication is done using Passport module,
 * as recommended by NestJS documentation,
 * including JWT generation and validation
 * https://docs.nestjs.com/techniques/authentication
 * https://github.com/auth0/node-jsonwebtoken#usage
 * https://github.com/nestjs/jwt/blob/master/README.md
 *
 * TODO : implement Passport strategies end-to-end
 * OPTION : AWS Cognito
 */

/** nestjs */
import { Module } from "@nestjs/common";
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
import { Constants } from "./enums/constants.enum";
////////////////////////////////////////////////////////////////////////////////

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: Constants.PASSPORT_STRATEGY,
    }),
    JwtModule.register({
      secret: Constants.JWT_SECRET,
      signOptions: { expiresIn: Constants.JWT_EXPIRESIN },
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
export class AuthModule {}
