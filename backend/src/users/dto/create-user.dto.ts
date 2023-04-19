import { IsString, IsEmail } from "class-validator";
//////////////////////////////////////////////////////////////////////////////////////

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  licenseNum: string;

  @IsString()
  role: string;
}
