import { NestFactory } from "@nestjs/core";

import { AppModule } from "./app.module";
////////////////////////////////////////////////////////////////////////////////

/** bootstrap project */
(async function () {
  /** instantiate new project */
  const app = await NestFactory.create(AppModule, { abortOnError: false });

  /** start server listener */
  await app.listen(3000);
})();
