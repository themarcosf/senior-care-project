/** nestjs */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UploadedFile,
  UseInterceptors,
  UnauthorizedException,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";

/** providers */
import { MedicalProgressionService } from "./medical-progression.service";

/** dependencies */
import { mkdir } from "fs";
import { diskStorage } from "multer";
import { Api, QueryField } from "./common/common.enum";
import { CreateMedicalProgressionDto } from "./dto/create-medical-progression.dto";
import { UpdateMedicalProgressionDto } from "./dto/update-medical-progression.dto";
////////////////////////////////////////////////////////////////////////////////

@Controller(Api.ADDR)
export class MedicalProgressionController {
  constructor(
    private readonly medicalProgressionService: MedicalProgressionService
  ) {}

  @UseInterceptors(
    FileInterceptor("medicalTests", {
      storage: diskStorage({
        destination: (req, file, cb) => {
          mkdir(
            `./uploads/medTests/${req.query.medicalRecord}`,
            { recursive: true },
            (err) => {
              if (err) new UnauthorizedException(err);
            }
          );
          cb(null, `./uploads/medTests/${req.query.medicalRecord}`);
        },
        filename: (req, file, cb) =>
          cb(null, `${Date.now()}-${file.originalname}`),
      }),
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif|pdf)$/)) {
          cb(
            new UnauthorizedException(
              "Accepted formats: JPG, JPEG, PNG, GIF, PDF"
            ),
            false
          );
        } else {
          cb(null, true);
        }
      },
      limits: {
        fileSize: 1024 * 1024 * 20, // 20MB
      },
    })
  )
  @Post()
  create(
    @Query(QueryField.MEDICAL_RECORD) medicalRecordId: number,
    @Body() createMedicalProgressionDto: CreateMedicalProgressionDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    if (file) createMedicalProgressionDto.medicalTests = [file.path];
    return this.medicalProgressionService.create(
      createMedicalProgressionDto,
      medicalRecordId
    );
  }

  @Get()
  findAll() {
    return this.medicalProgressionService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: number) {
    return this.medicalProgressionService.findOne(id);
  }

  @Patch(":id")
  update(
    @Param("id") id: number,
    @Body() updateMedicalProgressionDto: UpdateMedicalProgressionDto
  ) {
    return this.medicalProgressionService.update(
      id,
      updateMedicalProgressionDto
    );
  }

  @Delete(":id")
  remove(@Param("id") id: number) {
    return this.medicalProgressionService.remove(id);
  }
}
