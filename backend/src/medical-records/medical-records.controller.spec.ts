/** nestjs */
import { Test } from "@nestjs/testing";

/** controllers */
import { MedicalRecordsController } from "./medical-records.controller";

/** providers */
import { MedicalRecordsService } from "./medical-records.service";

/** dependencies */
import { MedicalRecord } from "./entities/medical-records.entity";
////////////////////////////////////////////////////////////////////////////////

// global test variables
let controller: MedicalRecordsController;

// mock data
const mockMedicalRecord: Partial<MedicalRecord> = {
  id: 1,
};

const mockMedicalRecords: Partial<MedicalRecord>[] = [mockMedicalRecord];

/* setup */
beforeAll(async () => {
  // mock implementation of create method
  const mockMedicalRecordService: Partial<MedicalRecordsService> = {
    create: jest.fn().mockImplementation(() => {
      mockMedicalRecords.push({
        id: mockMedicalRecords.length + 1,
      });

      return Promise.resolve(mockMedicalRecords[mockMedicalRecords.length - 1]);
    }),
    // mock implementation of findAll method
    findAll: jest.fn().mockResolvedValue(mockMedicalRecords),
    // mock implementation of findOne method
    findOne: jest.fn().mockImplementation((id: number) => {
      const foundMedicalRecord = mockMedicalRecords.find(
        (medicalRecord) => medicalRecord.id === id
      );

      return foundMedicalRecord
        ? Promise.resolve(foundMedicalRecord)
        : Promise.resolve(null);
    }),
  };

  // initialize test module
  const moduleRef = await Test.createTestingModule({
    controllers: [MedicalRecordsController],
    providers: [
      {
        provide: MedicalRecordsService,
        useValue: mockMedicalRecordService,
      },
    ],
  }).compile();

  controller = moduleRef.get<MedicalRecordsController>(
    MedicalRecordsController
  );
});

/** test suite */
describe("ProgressionTypeController", () => {
  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
