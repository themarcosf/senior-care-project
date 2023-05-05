/** nestjs */
import {
  Get,
  Req,
  Post,
  Body,
  HttpCode,
  UseGuards,
  Controller,
  HttpStatus,
  UnauthorizedException,
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

interface PassportRequest extends Request {
  user?: User;
}

interface PassportJwt {
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
  async signout(@Req() req: PassportRequest): Promise<void> {
    /**
     * TODO :
     * - add jwt to blacklist
     * - persist user session
     */
    return;
  }

  @Get(Api.PROFILE)
  profile(@Req() req: PassportRequest): User {
    if (!req.user) throw new UnauthorizedException("User not found");
    return req.user;
  }
}
