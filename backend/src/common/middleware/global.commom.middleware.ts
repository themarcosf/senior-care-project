/**
 * @fileoverview Global Middleware
 * global middleware do not access DI container
 * options : functional middleware OR class middleware consumed .forRoutes('*') within the AppModule
 */
import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
//////////////////////////////////////////////////////////////////////////////////////

@Injectable()
export class GlobalMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log("Request@LoggerMiddleware: ", req.method, req.url, "");
    next();
  }
}
