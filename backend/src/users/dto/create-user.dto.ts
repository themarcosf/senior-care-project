/**
 * @fileoverview Create user DTO
 * data transfer object : describe and validate properties of request body
 * validation is done by class-validator package and pipes
 */

import { IsString, IsEmail, IsOptional } from "class-validator";
//////////////////////////////////////////////////////////////////////////////////////

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  photo: string;

  @IsOptional()
  @IsString()
  role: string;
}
