import { PartialType } from '@nestjs/mapped-types';
import { CreatePsPtEquipDto } from './create-ps-pt-equip.dto';

export class UpdatePsPtEquipDto extends PartialType(CreatePsPtEquipDto) {}
