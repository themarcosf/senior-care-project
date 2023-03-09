import { Test, TestingModule } from '@nestjs/testing';
import { PsPtEquipService } from './ps-pt-equip.service';

describe('PsPtEquipService', () => {
  let service: PsPtEquipService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PsPtEquipService],
    }).compile();

    service = module.get<PsPtEquipService>(PsPtEquipService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
