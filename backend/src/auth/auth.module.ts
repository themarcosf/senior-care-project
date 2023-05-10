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
import { Auth } from "./common/common.enum";
////////////////////////////////////////////////////////////////////////////////

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: Auth.PASSPORT_STRATEGY,
    }),
    JwtModule.registerAsync({
      useFactory: async () => ({
        secret: process.env.JWT_SECRET,
        signOptions: {
          expiresIn: process.env.JWT_EXPIRES_IN,
        },
      }),
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
