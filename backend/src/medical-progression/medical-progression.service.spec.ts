/** nestjs */
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";

/** providers */
import { MedicalProgressionService } from "./medical-progression.service";
import { MedicalRecordsService } from "../medical-records/medical-records.service";
import { ProgressionTypeService } from "../progression-type/progression-type.service";

/** dependencies */
import { Repository } from "typeorm";

import { User } from "../users/entities/user.entity";
import { MedicalProgression } from "./entities/medical-progression.entity";
import { QueryRunnerFactory } from "../common/query-runner/query-runner.factory";
import { MedicalRecord } from "../medical-records/entities/medical-records.entity";
import { CreateMedicalProgressionDto } from "./dto/create-medical-progression.dto";
import { UpdateMedicalProgressionDto } from "./dto/update-medical-progression.dto";
import { QueryRunnerInterface } from "../common/query-runner/query-runner.interface";
import { ProgressionType } from "../progression-type/entities/progression-type.entity";
////////////////////////////////////////////////////////////////////////////////

// global test variables
let service: MedicalProgressionService;

// mock data
const mockCreateMedProgDto: CreateMedicalProgressionDto = {
  diagnosis: "mock diagnosis",
  medicalTests: ["mock test 1", "mock test 2"],
};

const mockMedRecord: MedicalRecord = {
  id: 1,
  clinicalStatus: true,
} as MedicalRecord;

const mockUser: User = { id: 1 } as User;

const mockProgType: ProgressionType = { id: 1 } as ProgressionType;

const mockMedProgs: MedicalProgression[] = [
  {
    id: 1,
    ...mockCreateMedProgDto,
    createdBy: Promise.resolve(mockUser),
    medicalRecord: Promise.resolve(mockMedRecord),
    progressionType: Promise.resolve(mockProgType),
    createdAt: Date.now(),
  } as unknown as MedicalProgression,
];

/** setup */
beforeAll(async () => {
  const mockRepository: Partial<Repository<MedicalProgression>> = {
    // mock implementation of create method
    create: jest.fn().mockImplementation((dto: CreateMedicalProgressionDto) => {
      mockMedProgs.push({
        id: mockMedProgs.length + 1,
        ...dto,
      } as MedicalProgression);

      return mockMedProgs[mockMedProgs.length - 1];
    }),
    // mock implementation of createQueryBuilder method
    createQueryBuilder: jest.fn().mockImplementation(() => {
      return {
        set: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        update: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(mockMedProgs),
        getOne: jest
          .fn()
          .mockImplementation(function (this: { where: jest.Mock }) {
            return mockMedProgs.find(
              (medProg) => medProg.id === this.where.mock.lastCall[1].id
            );
          }),
        execute: jest
          .fn()
          .mockImplementation(function (this: {
            where: jest.Mock;
            set: jest.Mock;
          }) {
            const updateData = this.set.mock.lastCall[0];
            const targetMedProgId = this.where.mock.lastCall[1].id - 1;

            if (updateData.diagnosis)
              mockMedProgs[targetMedProgId].diagnosis = updateData.diagnosis;
            if (updateData.medicalTests)
              mockMedProgs[targetMedProgId].medicalTests =
                updateData.medicalTests;
          }),
      };
    }),
  };

  // mock implementation of mockQueryRunnerFactory
  const mockQueryRunnerFactory: QueryRunnerInterface = {
    connect: jest.fn(),
    startTransaction: jest.fn(),
    commitTransaction: jest
      .fn()
      .mockImplementation((entity: MedicalProgression) => {
        mockMedProgs[entity.id - 1] = entity;
        return Promise.resolve(mockMedProgs[entity.id - 1]);
      }),
    rollbackTransaction: jest.fn(),
    release: jest.fn(),
  };

  const mockMedicalRecordService: Partial<MedicalRecordsService> = {
    // mock implementation of findOne method
    findOne: jest.fn().mockImplementation((id: number) => {
      if (id === 1) return Promise.resolve(mockMedRecord);
      if (id === 2)
        return Promise.resolve({ clinicalStatus: false } as MedicalRecord);
      return Promise.resolve(null);
    }),
  };
  const mockProgressionTypeService: Partial<ProgressionTypeService> = {
    // mock implementation of findOne method
    findOne: jest.fn().mockImplementation((id: number) => {
      if (id === 1) return Promise.resolve(mockProgType);
      return Promise.resolve(null);
    }),
  };

  // initialize test module
  const moduleRef: TestingModule = await Test.createTestingModule({
    providers: [
      MedicalProgressionService,
      {
        provide: getRepositoryToken(MedicalProgression),
        useValue: mockRepository,
      },
      {
        provide: QueryRunnerFactory,
        useValue: mockQueryRunnerFactory,
      },
      {
        provide: MedicalRecordsService,
        useValue: mockMedicalRecordService,
      },
      {
        provide: ProgressionTypeService,
        useValue: mockProgressionTypeService,
      },
    ],
  }).compile();

  service = moduleRef.get<MedicalProgressionService>(MedicalProgressionService);
});

/** test suite */
describe("MedicalProgressionService", () => {
  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("create method", () => {
    it("should return a medical progression", async () => {
      const medProg = await service.create(
        mockCreateMedProgDto,
        mockMedRecord.id,
        mockUser,
        mockProgType.id
      );

      expect(medProg).toBeDefined();
      expect(medProg).toHaveProperty("id", mockMedProgs.length);
      expect(medProg).toHaveProperty(
        "diagnosis",
        mockCreateMedProgDto.diagnosis
      );
      expect(medProg).toHaveProperty(
        "medicalTests",
        mockCreateMedProgDto.medicalTests
      );
      expect(medProg).toHaveProperty("createdBy", Promise.resolve(mockUser));
      expect(medProg).toHaveProperty(
        "medicalRecord",
        Promise.resolve(mockMedRecord)
      );
      expect(medProg).toHaveProperty(
        "progressionType",
        Promise.resolve(mockProgType)
      );
    });

    it("should throw an error if medical record not found", async () => {
      await expect(
        service.create({} as CreateMedicalProgressionDto, 999, {} as User, 999)
      ).rejects.toThrowError("Medical record not found or not active");
    });

    it("should throw an error if medical record not active", async () => {
      await expect(
        service.create({} as CreateMedicalProgressionDto, 2, {} as User, 999)
      ).rejects.toThrowError("Medical record not found or not active");
    });

    it("should throw an error if progression type not found", async () => {
      await expect(
        service.create({} as CreateMedicalProgressionDto, 1, {} as User, 999)
      ).rejects.toThrowError("Progression type not found");
    });
  });

  describe("findAll method", () => {
    it("should return an array of medical progressions", async () => {
      const medProgs = await service.findAll();

      expect(medProgs).toBeDefined();
      expect(medProgs).toHaveLength(mockMedProgs.length);
    });
  });

  describe("findOne method", () => {
    it("should return a medical progression", async () => {
      const medProg = await service.findOne(1);

      expect(medProg).toBeDefined();
      expect(medProg).toHaveProperty("id", 1);
    });

    it("should not be defined if medical progression not found", async () => {
      const medProg = await service.findOne(999);

      expect(medProg).not.toBeDefined();
    });
  });

  describe("update method", () => {
    it("should return an updated medical progression", async () => {
      const medProg = await service.update(1, {
        diagnosis: "updated mock diagnosis",
        medicalTests: ["updated mock test 1", "updated mock test 2"],
      } as UpdateMedicalProgressionDto);
      expect(medProg).toBeDefined();
      expect(medProg).toBe(mockMedProgs[0]);
    });

    it("should throw an error if medical progression not found", async () => {
      await expect(
        service.update(999, {} as UpdateMedicalProgressionDto)
      ).rejects.toThrowError("Medical progression not found");
    });

    it("should throw an error if request for update is not within 24 hours", async () => {
      mockMedProgs[0].createdAt = new Date(
        Date.now() - 24 * 60 * 60 * 1000 - 1
      );

      await expect(
        service.update(1, {} as UpdateMedicalProgressionDto)
      ).rejects.toThrowError(
        "Medical progression can only be updated within 24 hours"
      );
    });
  });
});
