import { SetMetadata } from "@nestjs/common";
import { Constants } from "./../enums/constants.enum";
////////////////////////////////////////////////////////////////////////////////

export const AllowAnon = () => SetMetadata(Constants.IS_PUBLIC_KEY, true);
