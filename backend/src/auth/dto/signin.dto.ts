/**
 * @fileoverview Signin DTO
 * data transfer object : describe and validate properties of request body
 */

import { IsString, IsEmail } from "class-validator";
//////////////////////////////////////////////////////////////////////////////////////

export class SigninDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
