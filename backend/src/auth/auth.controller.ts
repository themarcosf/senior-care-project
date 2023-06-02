/** nestjs */
import {
  Get,
  Req,
  Post,
  Body,
  Session,
  HttpCode,
  UseGuards,
  Controller,
  HttpStatus,
  UseInterceptors,
  UnauthorizedException,
  ClassSerializerInterceptor,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

/** providers */
import { AuthService } from "./auth.service";
import { UsersService } from "./../users/users.service";

/** dependencies */
import { Auth, Api } from "./common/common.enum";
import { User } from "../users/entities/user.entity";
import { AllowAnon } from "./guards/allow-anon.guard";
import { CreateUserDto } from "./../users/dto/create-user.dto";
////////////////////////////////////////////////////////////////////////////////

export interface PassportRequest extends Request {
  user?: User;
}

export interface PassportJwt {
  access_token: string;
}

@Controller(Api.ADDR)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService
  ) {}

  // TODO : change flux to admin create user
  @AllowAnon()
  @Post(Api.SIGNUP)
  async signup(@Body() createUserDto: CreateUserDto): Promise<PassportJwt> {
    return this.authService.login(
      await this.usersService.create(createUserDto)
    );
  }

  @AllowAnon()
  @UseGuards(AuthGuard(Auth.PASSPORT_STRATEGY))
  @HttpCode(HttpStatus.OK)
  @Post(Api.SIGNIN)
  async signin(@Req() req: PassportRequest): Promise<PassportJwt> {
    if (!req.user) throw new UnauthorizedException("User not found");

    return await this.authService.login(req.user);
  }

  @Get(Api.SIGNOUT)
  signout(@Req() req: PassportRequest): string {
    /**
     * TODO : add jwt to blacklist
     */
    return "TODO";
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(Api.PROFILE)
  async profile(
    @Session() session: Record<string, any>,
    @Req() req: PassportRequest
  ): Promise<User> {
    /**
     * TODO :
     * - implement and persist user session
     * session.visits = session.visits ? session.visits + 1 : 1;
     * console.log("Session id: ", session.id);
     * console.log(session);
     */

    if (!req.user) throw new UnauthorizedException("User not found");
    return req.user;
  }
}
