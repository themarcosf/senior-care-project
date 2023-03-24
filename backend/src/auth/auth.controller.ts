/** nestjs */
import {
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Controller,
  HttpStatus,
  ParseIntPipe,
  UseInterceptors,
} from "@nestjs/common";

/** providers */
// import { AuthService } from "./auth.service";
import { SigninDto } from "./dto/signin.dto";
import { AuthPipe } from "./pipes/auth.pipe";
import { AuthGuard } from "./guards/auth.guard";
import { RolesGuard } from "./guards/roles.guard";
import { Roles } from "./decorator/auth.decorator";
import { UsersService } from "./../users/users.service";
import { CreateUserDto } from "./../users/dto/create-user.dto";
import { AuthInterceptor } from "./interceptors/auth.interceptor";
////////////////////////////////////////////////////////////////////////////////

@Roles("user")
@Controller("api/v1/auth")
export class AuthController {
  constructor(
    // private readonly authService: AuthService,
    private readonly usersService: UsersService
  ) {}

  @UseInterceptors(AuthInterceptor)
  @Post("signup")
  signup(@Body(new AuthPipe()) createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Post("signin")
  signin(@Body() signinDto: SigninDto) {
    return "signin method";
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
