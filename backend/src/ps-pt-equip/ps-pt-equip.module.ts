import { Module } from '@nestjs/common';
import { PsPtEquipService } from './ps-pt-equip.service';
import { PsPtEquipController } from './ps-pt-equip.controller';

@Module({
  controllers: [PsPtEquipController],
  providers: [PsPtEquipService]
})
export class PsPtEquipModule {}
