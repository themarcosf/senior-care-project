/** nestjs */
import { Injectable, Inject } from "@nestjs/common";
////////////////////////////////////////////////////////////////////////////////

@Injectable()
export class ConfigService {
  constructor(@Inject("CONFIG_OPTIONS") options: Record<string, any>) {
    console.log("bootstrap@configModule: ", options.folder);
  }
}
