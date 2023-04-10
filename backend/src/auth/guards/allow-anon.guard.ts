import { SetMetadata } from "@nestjs/common";
import { Constants } from "./../../common/commom.enum";
////////////////////////////////////////////////////////////////////////////////

export const AllowAnon = () => SetMetadata(Constants.Auth.IS_PUBLIC_KEY, true);
