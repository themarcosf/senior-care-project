/** nestjs */
import { Get, Req, Body, Post, Controller, Param } from "@nestjs/common";

/** providers */
import { Api, ParamField } from "./common/common.enum";
import { PassportRequest } from "../auth/auth.controller";
import { ProgressionTypeService } from "./progression-type.service";
import { ProgressionType } from "./entities/progression-type.entity";
import { CreateProgressionTypeDto } from "./dto/create-progression-type.dto";
////////////////////////////////////////////////////////////////////////////////

@Controller(Api.ADDR)
export class ProgressionTypeController {
  constructor(
    private readonly progressionTypeService: ProgressionTypeService
  ) {}

  @Post()
  create(
    @Req() req: PassportRequest,
    @Body() createProgressionTypeDto: CreateProgressionTypeDto
  ): Promise<ProgressionType> {
    return this.progressionTypeService.create({
      ...createProgressionTypeDto,
      createdByUserId: req.user!.id,
    });
  }

  @Get()
  findAll(): Promise<ProgressionType[]> {
    return this.progressionTypeService.findAll();
  }

  @Get(Api.ID)
  findOne(@Param(ParamField.ID) id: number): Promise<ProgressionType | null> {
    return this.progressionTypeService.findOne(id);
  }
}
