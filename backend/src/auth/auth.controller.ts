/** nestjs */
import {
  Get,
  Req,
  Res,
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
import { LocalStrategy } from "./local.strategy";
import { UsersService } from "./../users/users.service";

/** dependencies */
import { Response } from "express";

import { SigninDto } from "./dto/signin.dto";
import { OutboundUserDto } from "./dto/outbound-user.dto";
import { CreateUserDto } from "./../users/dto/create-user.dto";
// import { RolesGuard } from "./guards/roles.guard";
import { LocalAuthGuard } from "./guards/local-auth.guard";
import { ExampleAuthGuard } from "./guards/example.guard";
import { AllowAnon } from "./guards/allow-anon.guard";
////////////////////////////////////////////////////////////////////////////////

/** TODO : implement crypto for password */

@Controller("api/v1/auth")
export class AuthController {
  constructor(
    private readonly localStrategy: LocalStrategy,
    private readonly usersService: UsersService // TODO : move to local strategy
  ) {}

  @AllowAnon()
  @Post("signup")
  signup(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @AllowAnon()
  @UseGuards(LocalAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(HttpStatus.OK)
  @Post("signin")
  signin(
    @Res({ passthrough: true }) res: Response,
    @Body() body: SigninDto
  ): OutboundUserDto {
    const [user, jwt] = this.localStrategy.validate(body);
    res.cookie("jwt", jwt);
    return new OutboundUserDto(user);
  }

  @UseGuards(ExampleAuthGuard)
  @Get("signout")
  signout(@Req() req: any) {
    return req.user;
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
