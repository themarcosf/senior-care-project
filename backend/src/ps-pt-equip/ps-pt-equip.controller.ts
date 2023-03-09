import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PsPtEquipService } from './ps-pt-equip.service';
import { CreatePsPtEquipDto } from './dto/create-ps-pt-equip.dto';
import { UpdatePsPtEquipDto } from './dto/update-ps-pt-equip.dto';

@Controller('ps-pt-equip')
export class PsPtEquipController {
  constructor(private readonly psPtEquipService: PsPtEquipService) {}

  @Post()
  create(@Body() createPsPtEquipDto: CreatePsPtEquipDto) {
    return this.psPtEquipService.create(createPsPtEquipDto);
  }

  @Get()
  findAll() {
    return this.psPtEquipService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.psPtEquipService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePsPtEquipDto: UpdatePsPtEquipDto) {
    return this.psPtEquipService.update(+id, updatePsPtEquipDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.psPtEquipService.remove(+id);
  }
}
