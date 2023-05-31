/** nestjs */
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";

/** providers */
import { MedicalRecordsService } from "./medical-records.service";

/** dependencies */
import { Repository } from "typeorm";

import { User } from "../users/entities/user.entity";
import { MedicalRecord } from "./entities/medical-records.entity";
import { CreateMedicalRecordDto } from "./dto/create-medical-record.dto";
import { QueryRunnerFactory } from "../common/query-runner/query-runner.factory";
import { QueryRunnerInterface } from "../common/query-runner/query-runner.interface";
////////////////////////////////////////////////////////////////////////////////

// global test variables
let service: MedicalRecordsService;

// mock data
const mockCreateMedRecordDto: CreateMedicalRecordDto = {
  patientFullName: "John Doe",
  birthDate: new Date("1990-01-01"),
  email: "john.doe@example.com",
  nationalId: "1234567890",
  icdCode: "A00",
  legalGuardian: "Jane Doe",
  legalGuardianIdNumber: "1234567890",
  legalGuardianPhone: "21-12345-6789",
  legalGuardianEmail: "jane.doe@example.com",
  insurancePlan: "Test Insurance Plan",
  insurancePolicyNumber: "1234567890",
  observation: "Test Observation",
};

const mockUser: User = {
  id: 1,
} as User;

const mockMedRecords = [
  {
    ...mockCreateMedRecordDto,
    id: 1,
    createdBy: Promise.resolve(mockUser),
    clinicalStatus: true,
  },
];

/** setup */
beforeAll(async () => {
  const mockRepository: Partial<Repository<MedicalRecord>> = {
    // mock implementation of create method
    create: jest
      .fn()
      .mockImplementation(function (this: { create: jest.Mock }) {
        return {
          ...this.create.mock.lastCall[0],
          id: mockMedRecords.length + 1,
          clinicalStatus: true,
        };
      }),
    // mock implementation of createQueryBuilder method
    createQueryBuilder: jest.fn().mockImplementation(() => {
      return {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        update: jest.fn().mockReturnThis(),
        set: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        getMany: jest.fn(() => mockMedRecords),
        getRawMany: jest
          .fn()
          .mockImplementation(function (this: { where: jest.Mock }) {
            if (this.where.mock.lastCall[0] === "progressions.id IS NOT NULL") {
              // return [mockMedRecords[0]];
              return [
                {
                  medRecord_id: mockMedRecords[0].id,
                  medRecord_patientFullName: mockMedRecords[0].patientFullName,
                  progressions_createdAt: "2021-08-31T17:00:00.000Z",
                },
              ];
            }
            if (this.where.mock.lastCall[0] === "progressions.id IS NULL") {
              return [
                {
                  medRecord_id: mockMedRecords[1].id,
                  medRecord_patientFullName: mockMedRecords[1].patientFullName,
                },
              ];
            }
            return null;
          }),
        getOne: jest.fn(function (this: { where: jest.Mock }) {
          return mockMedRecords.find(
            (medRecord) =>
              medRecord.id === this.where.mock.lastCall[1].id ||
              medRecord.patientFullName ===
                this.where.mock.lastCall[1].patientFullName
          );
        }),
        execute: jest
          .fn()
          .mockImplementation(function (this: {
            where: jest.Mock;
            set: jest.Mock;
          }) {
            const record = mockMedRecords.find(
              (record) => record.id === this.where.mock.lastCall[1].id
            );

            if (record)
              mockMedRecords[record.id - 1].clinicalStatus =
                this.set.mock.lastCall[0].clinicalStatus;
          }),
      };
    }),
    // mock implementation of findOne method
    findOne: jest
      .fn()
      .mockImplementation(function (this: { findOne: jest.Mock }) {
        return mockMedRecords.find(
          (medRecord) =>
            medRecord.nationalId ===
            this.findOne.mock.lastCall[0].where.nationalId
        );
      }),
  };

  // mock implementation of QueryRunnerFactory
  const mockQueryRunnerFactory: QueryRunnerInterface = {
    connect: jest.fn(),
    startTransaction: jest.fn(),
    commitTransaction: jest.fn().mockImplementation(function (this: any) {
      mockMedRecords.push(this.commitTransaction.mock.lastCall[0]);
    }),
    rollbackTransaction: jest.fn(),
    release: jest.fn(),
  };

  // initialize test module
  const moduleRef: TestingModule = await Test.createTestingModule({
    providers: [
      MedicalRecordsService,
      {
        provide: getRepositoryToken(MedicalRecord),
        useValue: mockRepository,
      },
      {
        provide: QueryRunnerFactory,
        useValue: mockQueryRunnerFactory,
      },
    ],
  }).compile();

  service = moduleRef.get<MedicalRecordsService>(MedicalRecordsService);
});

/** test suite */
describe("MedicalRecordsService", () => {
  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("create method", () => {
    it("should create a medical record", async () => {
      const newMedRecordDto: CreateMedicalRecordDto = {
        patientFullName: "John Smith",
        birthDate: new Date("1990-01-01"),
        email: "john.smith@example.com",
        nationalId: "09876543299",
        icdCode: "A00",
        legalGuardian: "Jane Smith",
        legalGuardianIdNumber: "1234567890",
        legalGuardianPhone: "11-12345-6789",
        legalGuardianEmail: "jane.smith@example.com",
        insurancePlan: "Test Insurance Plan",
        insurancePolicyNumber: "1234567890",
        observation: "Test Observation",
      };

      const medRecord = await service.create(newMedRecordDto, mockUser);

      expect(medRecord).toBeDefined();
      expect(medRecord).toEqual({
        ...newMedRecordDto,
        id: mockMedRecords.length,
        createdBy: Promise.resolve(mockUser),
        clinicalStatus: true,
      });
    });

    it("should throw an error if the national id already exists", async () => {
      await expect(
        service.create(mockCreateMedRecordDto, mockUser)
      ).rejects.toThrowError("National ID already exists");
    });
  });
});

describe("findAll method", () => {
  it("should return an array of medical records", async () => {
    const medRecords = await service.findAll("DESC");

    expect(medRecords).toBeDefined();
    expect(medRecords).toEqual([
      { id: 2, patientFullName: "John Smith", lastProgression: undefined },
      {
        id: 1,
        patientFullName: "John Doe",
        lastProgression: "2021-08-31T17:00:00.000Z",
      },
    ]);
  });
});

describe("findOne method", () => {
  it("should find a medical record by id", async () => {
    const medRecord = await service.findOne(1);

    expect(medRecord).toBeDefined();
    expect(medRecord).toEqual(mockMedRecords[0]);
  });

  it("should find a medical record by patient full name", async () => {
    const medRecord = await service.findOne("John Doe");

    expect(medRecord).toBeDefined();
    expect(medRecord).toEqual(mockMedRecords[0]);
  });

  it("should return null if no medical record is found", async () => {
    const medRecord = await service.findOne(999);

    expect(medRecord).not.toBeDefined();
  });
});

describe("toggleClinicalStatus method", () => {
  it("should toggle the clinical status of a medical record", async () => {
    const medRecord = await service.toggleClinicalStatus(1);

    expect(medRecord).toBeDefined();
    expect(medRecord).toEqual(mockMedRecords[0]);
  });
});
