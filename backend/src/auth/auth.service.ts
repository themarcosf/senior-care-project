/** nestjs */
import { JwtService } from "@nestjs/jwt";
import { Injectable } from "@nestjs/common";

/** providers */
import { UsersService } from "../users/users.service";

/** dependencies */
import { User } from "../users/entities/user.entity";
////////////////////////////////////////////////////////////////////////////////

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService
  ) {}

  validateUser(email: string, pass: string): User | null {
    const user = <User>this.usersService.findAll(email);
    return user?.password === pass ? user : null;
  }

  async login(user: any) {
    return {
      access_token: this.jwtService.sign({ email: user.email, sub: user.id }),
    };
  }
}
