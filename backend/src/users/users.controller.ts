/**
 * @fileoverview Controller for the users module
 *
 * Controllers handle HTTP requests and delegate more complex tasks to providers
 * Controllers are responsible for:
 * - validating request data
 * - transforming request data
 * - returning a response
 * - handling errors
 * - logging
 * - caching
 * Controllers are not responsible for:
 * - data persistence
 * - business logic
 * Controllers should be as thin as possible
 * SOLID Principles: https://en.wikipedia.org/wiki/SOLID
 */

import {
  Get,
  Req,
  Res,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  Controller,
} from "@nestjs/common";
import { Request, Response } from "express";
////////////////////////////////////////////////////////////////////////////////

import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

@Controller({ path: "api/v1/users", host: "127.0.0.1:3000" })
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /** @dev basic CRUD routes - should be restricted by IP  */
  @Post()
  create(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Body() createUserDto: CreateUserDto
  ) {
    console.log(req);

    const user = this.usersService.create(createUserDto);
    return res.status(HttpStatus.CREATED).json({
      message: "User created successfully",
      user,
    }); // 201
  }

  @Get()
  findAll(@Res({ passthrough: true }) res: Response) {
    const users = this.usersService.findAll();
    return res.status(HttpStatus.OK).json({
      message: "Users retrieved successfully",
      users,
    }); // 200
  }

  /**
   * routes with parameters should be declared after static paths
   * this prevents parameterized paths from intercepting traffic destined for static paths
   */
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.usersService.remove(+id);
  }
}
