/** nestjs */
import { NestFactory } from "@nestjs/core";

/** modules */
import { AppModule } from "./app.module";

/** providers */
import { LoggerMiddleware } from "./common/middleware/logger.middleware";
////////////////////////////////////////////////////////////////////////////////

/** bootstrap project */
(async function () {
  /** instantiate new project */
  const app = await NestFactory.create(AppModule, { abortOnError: false });

  /** apply middleware */
  // app.use(LoggerMiddleware);

  /** start server listener */
  await app.listen(3000);
})();
