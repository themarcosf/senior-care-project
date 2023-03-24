/** nestjs */
import {
  Get,
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
import { AuthService } from "./auth.service";
import { AuthGuard } from "./guards/auth.guard";
import { RolesGuard } from "./guards/roles.guard";
import { UsersService } from "./../users/users.service";

/** dependencies */
import { SigninDto } from "./dto/signin.dto";
import { OutboundUserDto } from "./dto/outbound-user.dto";
import { CreateUserDto } from "./../users/dto/create-user.dto";
import { Roles } from "./decorator/auth.decorator";
import { User } from "./../users/entities/user.entity";
////////////////////////////////////////////////////////////////////////////////

@Roles("user")
@Controller("api/v1/auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService
  ) {}

  @Post("signup")
  signup(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(HttpStatus.OK)
  @Post("signin")
  signin(@Body() signinDto: SigninDto): OutboundUserDto | null {
    return new OutboundUserDto(
      this.authService.validateUser(signinDto) as User
    );
  }

  @UseGuards(AuthGuard, RolesGuard)
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
