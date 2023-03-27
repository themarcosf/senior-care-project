/**
 * Controllers are responsible for handling incoming requests and returning
 * responses to the client. Think of them as entry points (routes)
 */

/** nestjs */
import {
  Get,
  Req,
  Post,
  Body,
  Param,
  HttpCode,
  UseGuards,
  Controller,
  HttpStatus,
  ParseIntPipe,
  UseInterceptors,
  ClassSerializerInterceptor,
} from "@nestjs/common";

/** providers */
import { LocalStrategy } from "./auth.strategy";
import { UsersService } from "./../users/users.service";

/** dependencies */
import { Request } from "express";

import { Roles } from "./decorator/auth.decorator";

import { SigninDto } from "./dto/signin.dto";
import { OutboundUserDto } from "./dto/outbound-user.dto";
import { CreateUserDto } from "./../users/dto/create-user.dto";

import { RolesGuard } from "./guards/roles.guard";
import { LocalAuthGuard } from "./guards/local-auth.guard";
import { ExampleAuthGuard } from "./guards/example-auth.guard";
////////////////////////////////////////////////////////////////////////////////

/**
 * GENERAL TODO :
 *
 * - implement crypto for password
 */

@Roles("user")
@Controller("api/v1/auth")
export class AuthController {
  constructor(
    private readonly localStrategy: LocalStrategy,
    private readonly usersService: UsersService
  ) {}

  @Post("signup")
  signup(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(LocalAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(HttpStatus.OK)
  @Post("signin")
  signin(@Req() req: Request, @Body() body: SigninDto): OutboundUserDto {
    console.log("req.user: ", req.user);
    return new OutboundUserDto(this.localStrategy.validate(body));
  }

  @UseGuards(ExampleAuthGuard, RolesGuard)
  @Get("signout")
  signout() {
    return "signout method";
  }

  @Get(":id")
  example(
    @Param(
      "id",
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })
    )
    id: number
  ) {
    return `built-in ParseIntPipe example, id: ${id}`;
  }
}
