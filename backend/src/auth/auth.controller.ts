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
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

/** providers */
import { AuthService } from "./auth.service";
import { UsersService } from "./../users/users.service";

/** dependencies */
import { Constants } from "../common/commom.enum";
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

@Controller(Constants.Auth.ADDR)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService
  ) {}

  @AllowAnon()
  @Post(Constants.Auth.SIGNUP)
  async signup(@Body() createUserDto: CreateUserDto): Promise<PassportJwt> {
    return this.authService.login(
      await this.usersService.create(createUserDto)
    );
  }

  @AllowAnon()
  @UseGuards(AuthGuard(Constants.Auth.PASSPORT_STRATEGY))
  @HttpCode(HttpStatus.OK)
  @Post(Constants.Auth.SIGNIN)
  async signin(@Req() req: PassportRequest): Promise<PassportJwt> {
    return await this.authService.login(req.user);
  }

  @Get(Constants.Auth.SIGNOUT)
  signout(@Req() req: any): void {
    /**
     * TODO :
     * - add jwt to blacklist
     * - persist user session
     */
    return;
  }

  @Get(Constants.Auth.PROFILE)
  profile(@Req() req: any): User {
    return req.user;
  }
}
