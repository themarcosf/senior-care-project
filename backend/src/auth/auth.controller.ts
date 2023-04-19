/** nestjs */
import {
  Get,
  Req,
  Post,
  Body,
  Query,
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

  @AllowAnon()
  @Post(Api.SIGNUP)
  async signup(
    @Body() createUserDto: CreateUserDto,
    @Query("role") role: string
  ): Promise<PassportJwt> {
    return this.authService.login(
      await this.usersService.create(createUserDto, role)
    );
  }

  @AllowAnon()
  @UseGuards(AuthGuard(Auth.PASSPORT_STRATEGY))
  @HttpCode(HttpStatus.OK)
  @Post(Api.SIGNIN)
  async signin(@Req() req: PassportRequest): Promise<PassportJwt> {
    return await this.authService.login(req.user);
  }

  @Get(Api.SIGNOUT)
  async signout(@Req() req: any): Promise<void> {
    /**
     * TODO :
     * - add jwt to blacklist
     * - persist user session
     */
    return;
  }

  @Get(Api.PROFILE)
  profile(@Req() req: any): User {
    return req.user;
  }
}
