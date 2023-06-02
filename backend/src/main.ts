/** nestjs */
import {
  ValidationPipe,
  INestApplication,
  ClassSerializerInterceptor,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory, Reflector } from "@nestjs/core";

/** modules */
import { AppModule } from "./app.module";

/** dependencies */
import helmet from "helmet";
import * as compression from "compression";
import * as session from "express-session";
import * as cookieParser from "cookie-parser";
////////////////////////////////////////////////////////////////////////////////

/** bootstrap project */
(async function () {
  /** instantiate new project */
  const app: INestApplication = await NestFactory.create(AppModule, {
    cors: true,
  });

  /** set global prefix */
  app.setGlobalPrefix("api/v1");

  /** generic middleware */
  app.use(helmet());
  app.use(compression());
  app.use(cookieParser());
  app.use(
    session({
      secret: [process.env.SESSION_SECRET!],
      cookie: {
        maxAge: 3600000,
        secure: process.env.NODE_ENV === "prod" ? true : false,
      },
      resave: false, // check store if this is needed
      saveUninitialized: false,
      store: new session.MemoryStore(), // change this to redis+elastiCache for prod
    })
  );

  /** empty global validation pipe; configured at handler level */
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      disableErrorMessages:
        app.get(ConfigService).get("NODE_ENV") === "prod" ? true : false,
    })
  );

  /** global serialization interceptor */
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  /** start server listener */
  await app.listen(3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
})();
