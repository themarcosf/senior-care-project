/** nestjs */
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";

/** providers */
import { ProgressionTypeService } from "./progression-type.service";

/** dependencies */
import { Repository } from "typeorm";

import { User } from "../users/entities/user.entity";
import { ProgressionType } from "./entities/progression-type.entity";
import { CreateProgressionTypeDto } from "./dto/create-progression-type.dto";
import { QueryRunnerFactory } from "../common/query-runner/query-runner.factory";
import { QueryRunnerInterface } from "../common/query-runner/query-runner.interface";
////////////////////////////////////////////////////////////////////////////////

// global test variables
let service: ProgressionTypeService;

// mock data
const mockCreateProgTypeDto: CreateProgressionTypeDto = {
  description: "description",
  toggleClinicalStatus: true,
};

const mockUser: User = {
  id: 1,
} as User;

const mockProgTypes = [
  { ...mockCreateProgTypeDto, id: 1, createdBy: mockUser },
];

/** setup */
beforeAll(async () => {
  const mockRepository: Partial<Repository<ProgressionType>> = {
    // mock implementation of create method
    create: jest.fn().mockImplementation(function (this: any) {
      return {
        ...this.create.mock.lastCall[0],
        id: mockProgTypes.length + 1,
      };
    }),
    // mock implementation of createQueryBuilder method
    createQueryBuilder: jest.fn().mockImplementation(() => {
      return {
        where: jest.fn().mockReturnThis(),
        getMany: jest.fn(() => mockProgTypes),
        getOne: jest.fn(function (this: { where: jest.Mock }) {
          if (this.where.mock.lastCall[1].id === mockProgTypes[0].id) {
            return mockProgTypes[0];
          }
          return null;
        }),
      };
    }),
  };

  // mock implementation of QueryRunnerFactory
  const mockQueryRunnerFactory: QueryRunnerInterface = {
    connect: jest.fn(),
    startTransaction: jest.fn(),
    commitTransaction: jest.fn().mockImplementation(function (this: any) {
      mockProgTypes.push(this.commitTransaction.mock.lastCall[0]);
    }),
    rollbackTransaction: jest.fn(),
    release: jest.fn(),
  };

  // initialize test module
  const moduleRef: TestingModule = await Test.createTestingModule({
    providers: [
      ProgressionTypeService,
      {
        provide: getRepositoryToken(ProgressionType),
        useValue: mockRepository,
      },
      {
        provide: QueryRunnerFactory,
        useValue: mockQueryRunnerFactory,
      },
    ],
  }).compile();

  service = moduleRef.get<ProgressionTypeService>(ProgressionTypeService);
});

/** test suite */
describe("ProgressionTypeService", () => {
  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("create method", () => {
    it("should create a progression type", async () => {
      const newProgTypeDto: CreateProgressionTypeDto = {
        description: "other description",
        toggleClinicalStatus: false,
      };

      const progType = await service.create(newProgTypeDto, mockUser);

      expect(progType).toBeDefined();
      expect(progType).toEqual({
        ...newProgTypeDto,
        id: mockProgTypes.length,
        createdBy: Promise.resolve(mockUser),
      });
    });
  });

  describe("findAll method", () => {
    it("should return an array of progression types", async () => {
      const progTypes = await service.findAll();
      expect(progTypes).toBeDefined();
      expect(progTypes).toEqual(mockProgTypes);
      expect(progTypes).toHaveLength(mockProgTypes.length);
    });
  });

  describe("findOne method", () => {
    it("should find a progression type by id", async () => {
      const progType = await service.findOne(1);
      expect(progType).toBeDefined();
      expect(progType).toEqual(mockProgTypes[0]);
    });

    it("should return null if no progression type is found", async () => {
      const progType = await service.findOne(999);
      expect(progType).toBeNull();
    });
  });
});
