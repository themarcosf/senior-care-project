/**
 * @fileoverview Create user pipe DTO
 * data transfer object : describe and validate properties of request body
 * validation is done by class-validator package and pipes
 */

import { IsString, IsEmail } from "class-validator";
//////////////////////////////////////////////////////////////////////////////////////

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
