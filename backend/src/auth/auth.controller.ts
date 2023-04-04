/** nestjs */
import {
  Get,
  Res,
  Post,
  Body,
  Logger,
  HttpCode,
  UseGuards,
  Controller,
  HttpStatus,
  UseInterceptors,
  ClassSerializerInterceptor,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

/** providers */
import { LocalStrategy } from "./local.strategy";
import { UsersService } from "./../users/users.service";

/** dependencies */
import { Response } from "express";

import { Constants } from "./enums/constants.enum";
import { AllowAnon } from "./guards/allow-anon.guard";
import { SigninDto } from "./dto/signin.dto";
import { OutboundUserDto } from "./dto/outbound-user.dto";
import { CreateUserDto } from "./../users/dto/create-user.dto";
////////////////////////////////////////////////////////////////////////////////

@Controller("api/v1/auth")
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private readonly localStrategy: LocalStrategy,
    private readonly usersService: UsersService
  ) {}

  @AllowAnon()
  @UseGuards(AuthGuard(Constants.PASSPORT_STRATEGY))
  @UseInterceptors(ClassSerializerInterceptor)
  @Post("signup")
  signup(
    @Res({ passthrough: true }) res: Response,
    @Body() createUserDto: CreateUserDto
  ): OutboundUserDto {
    this.logger.log(
      `Transformed Create User DTO: ${JSON.stringify(createUserDto)}`
    );
    const [user, jwt] = this.localStrategy.validate(
      this.usersService.create(createUserDto)
    );
    res.cookie("jwt", jwt);
    return new OutboundUserDto(user);
  }

  @AllowAnon()
  @UseGuards(AuthGuard(Constants.PASSPORT_STRATEGY))
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(HttpStatus.OK)
  @Post("signin")
  signin(
    @Res({ passthrough: true }) res: Response,
    @Body() signinDto: SigninDto
  ): OutboundUserDto {
    this.logger.log(`Transformed Signin DTO: ${JSON.stringify(signinDto)}`);
    const [user, jwt] = this.localStrategy.validate(signinDto);
    res.cookie("jwt", jwt);
    return new OutboundUserDto(user);
  }

  @Get("signout")
  signout(@Res({ passthrough: true }) res: Response): void {
    res.clearCookie("jwt");
    return;
  }
}
