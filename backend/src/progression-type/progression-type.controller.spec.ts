/** nestjs */
import { Test } from "@nestjs/testing";

/** controllers */
import { ProgressionTypeController } from "./progression-type.controller";

/** providers */
import { ProgressionTypeService } from "./progression-type.service";

/** dependencies */
import { ProgressionType } from "./entities/progression-type.entity";
import { CreateProgressionTypeDto } from "./dto/create-progression-type.dto";
import { MedicalProgression } from "../medical-progression/entities/medical-progression.entity";
import { PassportRequest } from "../auth/auth.controller";
////////////////////////////////////////////////////////////////////////////////

let controller: ProgressionTypeController;

beforeAll(async () => {
  // create custom provider ProgressionTypeService
  const mockProgressionTypeService: Partial<ProgressionTypeService> = {
    create: (createProgressionTypeDto: CreateProgressionTypeDto) =>
      Promise.resolve({
        description: createProgressionTypeDto.description,
        toggleStatus: createProgressionTypeDto.toggleStatus,
        createdByUserId: createProgressionTypeDto.createdByUserId,
        isActive: true,
        progressions: Promise.resolve([] as MedicalProgression[]),
      } as ProgressionType),
  };

  const moduleRef = await Test.createTestingModule({
    controllers: [ProgressionTypeController],
    providers: [
      {
        provide: ProgressionTypeService,
        useValue: mockProgressionTypeService,
      },
    ],
  }).compile();

  controller = moduleRef.get<ProgressionTypeController>(
    ProgressionTypeController
  );
});

describe("ProgressionTypeController", () => {
  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("create", () => {
    // mock implementation of @Req() req: PassportRequest
    const mockReq = { user: { id: 1 } };

    // mock implementation of createProgressionTypeDto
    const mockCreateProgressionTypeDto = {
      description: "mock description",
      toggleStatus: false,
      createdByUserId: mockReq.user.id,
    };

    it("should return a ProgressionType", async () => {
      const result = await controller.create(
        mockReq as PassportRequest,
        mockCreateProgressionTypeDto
      );
      expect(result).toBeDefined();
      expect(result).toHaveProperty("description");
      expect(result).toHaveProperty("toggleStatus");
      expect(result).toHaveProperty("createdByUserId");
      expect(result).toHaveProperty("isActive");
      expect(result).toHaveProperty("progressions");
    });
  });
});
