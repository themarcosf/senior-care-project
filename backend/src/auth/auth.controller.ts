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
} from "@nestjs/common";

/** providers */
import { AuthService } from "./auth.service";
import { SigninDto } from "./dto/signin.dto";
import { AuthPipe } from "./pipes/auth.pipe";
import { AuthGuard } from "./guards/auth.guard";
import { RolesGuard } from "./guards/roles.guard";
import { Roles } from "./decorator/auth.decorator";
import { UsersService } from "src/users/users.service";
import { CreateUserDto } from "src/users/dto/create-user.dto";
////////////////////////////////////////////////////////////////////////////////

@Controller("api/v1/auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService
  ) {}

  @Post("signup")
  signup(@Body(new AuthPipe()) createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Post("signin")
  signin(@Body() signinDto: SigninDto) {
    return "signin method";
  }

  @UseGuards(AuthGuard)
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
    return `pipe example, id: ${id}`;
  }
}
