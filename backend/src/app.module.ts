import { Module } from "@nestjs/common";
import { UsersModule } from './users/users.module';
import { PsPtEquipModule } from './ps-pt-equip/ps-pt-equip.module';
import { IssuanceModule } from './issuance/issuance.module';

@Module({
  imports: [UsersModule, PsPtEquipModule, IssuanceModule]
})
export class AppModule {}
