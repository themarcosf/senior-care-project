import { Injectable } from '@nestjs/common';
import { CreatePsPtEquipDto } from './dto/create-ps-pt-equip.dto';
import { UpdatePsPtEquipDto } from './dto/update-ps-pt-equip.dto';

@Injectable()
export class PsPtEquipService {
  create(createPsPtEquipDto: CreatePsPtEquipDto) {
    return 'This action adds a new psPtEquip';
  }

  findAll() {
    return `This action returns all psPtEquip`;
  }

  findOne(id: number) {
    return `This action returns a #${id} psPtEquip`;
  }

  update(id: number, updatePsPtEquipDto: UpdatePsPtEquipDto) {
    return `This action updates a #${id} psPtEquip`;
  }

  remove(id: number) {
    return `This action removes a #${id} psPtEquip`;
  }
}
