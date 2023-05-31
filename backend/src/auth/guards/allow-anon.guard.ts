import { SetMetadata } from "@nestjs/common";
import { Auth } from "../common/common.enum";
////////////////////////////////////////////////////////////////////////////////

/**
 * AllowAnon Guard
 *
 * @see https://docs.nestjs.com/security/authentication#enable-authentication-globally
 */

export const AllowAnon = () => SetMetadata(Auth.IS_PUBLIC_KEY, true);
