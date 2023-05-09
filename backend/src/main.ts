/** nestjs */
import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";

/** modules */
import { AppModule } from "./app.module";

/** dependencies */
import helmet from "helmet";
import * as session from "express-session";
import * as cookieParser from "cookie-parser";
////////////////////////////////////////////////////////////////////////////////

/** bootstrap project */
(async function () {
  /** instantiate new project */
  const app = await NestFactory.create(AppModule, { cors: true });

  /** generic middleware */
  app.use(helmet());
  app.use(cookieParser());
  app.use(
    session({
      secret: ["secret"], // change this to env variable
      cookie: {
        maxAge: 3600000,
        secure: process.env.NODE_ENV === "prod" ? true : false,
      },
      resave: false, // check store if this is needed
      saveUninitialized: false,
      store: new session.MemoryStore(), // change this to redis store for prod
    })
  );

  /** empty global validation pipe; configured at handler level */
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  /** start server listener */
  await app.listen(3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
})();
