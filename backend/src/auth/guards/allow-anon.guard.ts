import { SetMetadata } from "@nestjs/common";
import { Auth } from "../common/common.enum";
////////////////////////////////////////////////////////////////////////////////

export const AllowAnon = () => SetMetadata(Auth.IS_PUBLIC_KEY, true);
