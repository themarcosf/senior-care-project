/** nestjs */
import { Test } from "@nestjs/testing";

/** controllers */
import { MedicalRecordsController } from "./medical-records.controller";

/** providers */
import { MedicalRecordsService } from "./medical-records.service";

/** dependencies */
import { PassportRequest } from "../auth/auth.controller";
import { MedicalRecord } from "./entities/medical-records.entity";
import { CreateMedicalRecordDto } from "./dto/create-medical-record.dto";
////////////////////////////////////////////////////////////////////////////////

// global test variables
let controller: MedicalRecordsController;

// mock data
const mockMedicalRecord: Partial<MedicalRecord> = {
  id: 1,
  patientFullName: "John Doe",
  clinicalStatus: true,
};

const mockMedicalRecords: Partial<MedicalRecord>[] = [mockMedicalRecord];

/* setup */
beforeAll(async () => {
  const mockMedicalRecordService: Partial<MedicalRecordsService> = {
    // mock implementation of create method
    create: jest.fn().mockImplementation(function (this: any) {
      mockMedicalRecords.push({
        id: mockMedicalRecords.length + 1,
        patientFullName: this.create.mock.lastCall[0].patientFullName,
      });

      return Promise.resolve(mockMedicalRecords[mockMedicalRecords.length - 1]);
    }),
    // mock implementation of findAll method
    findAll: jest.fn().mockResolvedValue(mockMedicalRecords),
    // mock implementation of findOne method
    findOne: jest.fn().mockImplementation((criteria: number | string) => {
      const foundMedicalRecord = mockMedicalRecords.find(
        (medicalRecord) =>
          medicalRecord.id === criteria ||
          medicalRecord.patientFullName === criteria
      );

      return foundMedicalRecord
        ? Promise.resolve(foundMedicalRecord)
        : Promise.resolve(null);
    }),
    // mock implementation of toggleClinicalStatus method
    toggleClinicalStatus: jest.fn().mockImplementation((id: number) => {
      const foundMedicalRecord = mockMedicalRecords.find(
        (medicalRecord) => medicalRecord.id === id
      );

      if (foundMedicalRecord)
        foundMedicalRecord.clinicalStatus = !foundMedicalRecord.clinicalStatus;

      return foundMedicalRecord ? Promise.resolve(foundMedicalRecord) : null;
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
describe("MedicalRecordsController", () => {
  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("create method", () => {
    it("should create a medical record", async () => {
      const newMedicalRecord = await controller.create(
        { user: { id: 1 } } as PassportRequest,
        { patientFullName: "John Doe" } as CreateMedicalRecordDto
      );

      expect(newMedicalRecord).toEqual({
        id: mockMedicalRecords.length,
        patientFullName: "John Doe",
      });
    });
  });

  describe("findAll method", () => {
    it("should return all medical records", async () => {
      const medicalRecords = await controller.findAll();

      expect(medicalRecords).toEqual(mockMedicalRecords);
    });
  });

  describe("findOne method", () => {
    it("should return a medical record by id", async () => {
      const medicalRecord = await controller.findOne(1, undefined);
      expect(medicalRecord).toEqual(mockMedicalRecord);
    });

    it("should return a medical record by patient full name", async () => {
      const medicalRecord = await controller.findOne(undefined, "John Doe");
      expect(medicalRecord).toEqual(mockMedicalRecord);
    });
  });

  describe("toggleClinicalStatus method", () => {
    it("should toggle clinical status of a medical record", async () => {
      const medicalRecord = await controller.toggleClinicalStatus(1);
      expect(medicalRecord).toEqual({
        ...mockMedicalRecord,
        clinicalStatus: false,
      });
    });
  });
});
