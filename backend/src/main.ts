/** nestjs */
import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";

/** modules */
import { AppModule } from "./app.module";

/** dependencies */
import * as cookieParser from "cookie-parser";
////////////////////////////////////////////////////////////////////////////////

/** bootstrap project */
(async function () {
  /** instantiate new project */
  const app = await NestFactory.create(AppModule, { abortOnError: false });

  /** generic middleware */
  app.use(cookieParser());

  /** empty global validation pipe; configured at handler level */
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  /** start server listener */
  await app.listen(3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
})();
