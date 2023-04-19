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
import { DataSource, EntityManager } from "typeorm";
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
    private readonly usersService: UsersService,
    private readonly dataSource: DataSource,
    private readonly entityManager: EntityManager
  ) {}

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
    return await this.authService.login(req.user);
  }

  @Get(Api.SIGNOUT)
  async signout(@Req() req: any): Promise<void> {
    console.log(this.dataSource);
    console.log(this.entityManager);
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
