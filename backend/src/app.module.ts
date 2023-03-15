import { Module } from "@nestjs/common";

import { UsersModule } from "./users/users.module";
import { IssuanceModule } from "./issuance/issuance.module";
import { PsPtEquipModule } from "./ps-pt-equip/ps-pt-equip.module";
////////////////////////////////////////////////////////////////////////////////

@Module({
  imports: [UsersModule, PsPtEquipModule, IssuanceModule],
})
export class AppModule {}
