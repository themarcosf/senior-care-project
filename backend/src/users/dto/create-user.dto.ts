import { IsString, IsEmail } from "class-validator";
//////////////////////////////////////////////////////////////////////////////////////

/** data transfer object [Dto] : describe and validate properties of request body */
export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  function: string;

  @IsString()
  department: string;

  @IsString()
  photo: string;

  @IsString()
  thumbprint: string;

  @IsString()
  password: string;
}
