/** nestjs */
import { Test } from "@nestjs/testing";

/** controllers */
import { ProgressionTypeController } from "./progression-type.controller";

/** providers */
import { ProgressionTypeService } from "./progression-type.service";

/** dependencies */
import { User } from "../users/entities/user.entity";
import { PassportRequest } from "../auth/auth.controller";
import { ProgressionType } from "./entities/progression-type.entity";
import { CreateProgressionTypeDto } from "./dto/create-progression-type.dto";
import { MedicalProgression } from "../medical-progression/entities/medical-progression.entity";
////////////////////////////////////////////////////////////////////////////////

// global test variables
let controller: ProgressionTypeController;

// mock data
const mockProgressionType: Partial<ProgressionType> = {
  id: 1,
  description: "mock description",
  toggleClinicalStatus: false,
  isActive: true,
  createdBy: Promise.resolve(<User>{ id: 1 }),
  progressions: Promise.resolve(<MedicalProgression[]>[]),
};

const mockProgressionTypes: Partial<ProgressionType>[] = [mockProgressionType];

/* setup */
beforeAll(async () => {
  // mock implementation of create method
  const mockProgressionTypeService: Partial<ProgressionTypeService> = {
    create: jest.fn().mockImplementation(function (this: any) {
      mockProgressionTypes.push({
        id: mockProgressionTypes.length + 1,
        description: this.create.mock.lastCall[0].description,
        toggleClinicalStatus: this.create.mock.lastCall[0].toggleClinicalStatus,
        createdBy: this.create.mock.lastCall[1],
        isActive: true,
        progressions: Promise.resolve(<MedicalProgression[]>[]),
      });

      return Promise.resolve(
        mockProgressionTypes[mockProgressionTypes.length - 1]
      );
    }),
    // mock implementation of findAll method
    findAll: jest.fn().mockResolvedValue(mockProgressionTypes),
    // mock implementation of findOne method
    findOne: jest.fn().mockImplementation((id: number) => {
      const foundProgressionType = mockProgressionTypes.find(
        (progressionType) => progressionType.id === id
      );

      return foundProgressionType
        ? Promise.resolve(foundProgressionType)
        : Promise.resolve(null);
    }),
  };

  // initialize test module
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

/** test suite */
describe("ProgressionTypeController", () => {
  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("create method", () => {
    const mockReq: Partial<PassportRequest> = { user: <User>{ id: 1 } };

    const mockCreateProgressionTypeDto: Partial<CreateProgressionTypeDto> = {
      description: "mock description",
      toggleClinicalStatus: false,
    };

    it("should return a ProgressionType", async () => {
      const result = await controller.create(
        <PassportRequest>mockReq,
        <CreateProgressionTypeDto>mockCreateProgressionTypeDto
      );
      expect(result).toBeDefined();
      expect(result).toBe(
        mockProgressionTypes[mockProgressionTypes.length - 1]
      );
    });
  });

  describe("findAll method", () => {
    it("should return an array of ProgressionTypes", async () => {
      const result = await controller.findAll();
      expect(result).toBeDefined();
      expect(result).toHaveLength(mockProgressionTypes.length);
    });
  });

  describe("findOne method", () => {
    it("should return a ProgressionType", async () => {
      const result = await controller.findOne(1);
      expect(result).toBeDefined();
      expect(result).toBe(mockProgressionTypes[0]);
    });

    it("should return null if ProgressionType is not found", async () => {
      const result = await controller.findOne(999);
      expect(result).toBeNull();
    });
  });
});
