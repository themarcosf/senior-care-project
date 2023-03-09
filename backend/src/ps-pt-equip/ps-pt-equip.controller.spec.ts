import { Test, TestingModule } from '@nestjs/testing';
import { PsPtEquipController } from './ps-pt-equip.controller';
import { PsPtEquipService } from './ps-pt-equip.service';

describe('PsPtEquipController', () => {
  let controller: PsPtEquipController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PsPtEquipController],
      providers: [PsPtEquipService],
    }).compile();

    controller = module.get<PsPtEquipController>(PsPtEquipController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
