/**
 * @fileoverview User Middleware
 *
 * middleware are NOT ExecutionContext specific
 * custom and built-in middleware can be chained in fluent style
 * wiki: https://en.wikipedia.org/wiki/Fluent_interface
 */
import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
//////////////////////////////////////////////////////////////////////////////////////

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log("Request@AuthMiddleware: ", req.method, req.url, "");

    next();
  }
}

/**
 * example: functional middleware
 *
 * export function userMiddleware(req: Request, res: Response, next: NextFunction) {
 * console.log("Request@UserMiddleware: ", req.method, req.url, "");
 * next();
 * };
 */
