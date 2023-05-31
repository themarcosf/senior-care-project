/** nestjs */
import { Test } from "@nestjs/testing";

/** controllers */
import { MedicalProgressionController } from "./medical-progression.controller";

/** providers */
import { MedicalProgressionService } from "./medical-progression.service";
import { CreateMedicalProgressionDto } from "./dto/create-medical-progression.dto";

/** dependencies */
import { PassportRequest } from "../auth/auth.controller";
import { MedicalProgression } from "./entities/medical-progression.entity";
////////////////////////////////////////////////////////////////////////////////

// global test variables
let controller: MedicalProgressionController;

// mock data
const mockMedProg: Partial<MedicalProgression> = {
  id: 1,
  diagnosis: "mock diagnosis",
};

const mockMedProgs: Partial<MedicalProgression>[] = [mockMedProg];

/* setup */
beforeAll(async () => {
  const mockMedicalProgressionService: Partial<MedicalProgressionService> = {
    // mock implementation of create method
    create: jest.fn().mockReturnValue(mockMedProg),

    // mock implementation of findAll method
    findAll: jest.fn().mockReturnValue(mockMedProgs),

    // mock implementation of findOne method
    findOne: jest.fn().mockReturnValue(mockMedProg),

    // mock implementation of update method
    update: jest.fn().mockReturnValue(mockMedProg),
  };

  // initialize test module
  const moduleRef = await Test.createTestingModule({
    controllers: [MedicalProgressionController],
    providers: [
      {
        provide: MedicalProgressionService,
        useValue: mockMedicalProgressionService,
      },
    ],
  }).compile();

  controller = moduleRef.get<MedicalProgressionController>(
    MedicalProgressionController
  );
});

/** test suite */
describe("MedicalRecordsController", () => {
  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("create method", () => {
    it("should return a medical progression", async () => {
      const medProg = await controller.create(
        { user: {} } as PassportRequest,
        1,
        1,
        {} as CreateMedicalProgressionDto,
        "file" as unknown as Express.Multer.File
      );

      expect(medProg).toBeDefined();
    });
  });

  describe("findAll method", () => {
    it("should return an array of medical progressions", async () => {
      const medProgs = await controller.findAll();

      expect(medProgs).toBeDefined();
    });
  });

  describe("findOne method", () => {
    it("should return a medical progression", async () => {
      const medProg = await controller.findOne(1);

      expect(medProg).toBeDefined();
    });
  });

  describe("update method", () => {
    it("should return a medical progression", async () => {
      const medProg = await controller.update(
        1,
        {} as CreateMedicalProgressionDto
      );

      expect(medProg).toBeDefined();
    });
  });
});
