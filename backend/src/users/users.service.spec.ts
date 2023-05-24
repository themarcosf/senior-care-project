/** nestjs */
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";

/** dependencies */
import { Repository } from "typeorm";

import { User } from "./entities/user.entity";
import { UsersService } from "./users.service";
import { QueryRunnerFactory } from "../common/query-runner/query-runner.factory";
import { QueryRunnerInterface } from "../common/query-runner/query-runner.interface";
////////////////////////////////////////////////////////////////////////////////

// global test variables
let service: UsersService;

// mock data
const mockCreateUserDto = {
  name: "Teste",
  email: "teste@example.com",
  password: "123456",
  licenseNum: "123456",
  role: "role",
};

const mockUsers = [{ ...mockCreateUserDto, id: 1 }];

// mock queryBuilder
interface QueryBuilder {
  where: jest.Mock;
  getOne: jest.Mock;
}

/** setup */
beforeAll(async () => {
  const mockRepository: Partial<Repository<User>> = {
    // mock implementation of create method
    create: jest.fn().mockImplementation(function (this: any) {
      mockUsers.push({
        ...this.create.mock.lastCall[0],
        id: mockUsers.length + 1,
      });

      return mockUsers[mockUsers.length - 1];
    }),
    // mock implementation of createQueryBuilder method
    createQueryBuilder: jest.fn().mockImplementation(() => {
      return {
        where: jest.fn().mockReturnThis(),
        getMany: jest.fn(() => mockUsers),
        getOne: jest.fn(function (this: QueryBuilder) {
          if (this.where.mock.lastCall[1].id === mockUsers[0].id) {
            return mockUsers[0];
          }
          if (this.where.mock.lastCall[1].email === mockUsers[0].email) {
            return mockUsers[0];
          }
          return null;
        }),
      };
    }),
  };

  const mockQueryRunnerFactory: QueryRunnerInterface = {
    connect: jest.fn(),
    startTransaction: jest.fn(),
    commitTransaction: jest.fn(),
    rollbackTransaction: jest.fn(),
    release: jest.fn(),
  };

  // initialize test module
  const moduleRef: TestingModule = await Test.createTestingModule({
    providers: [
      UsersService,
      {
        provide: getRepositoryToken(User),
        useValue: mockRepository,
      },
      {
        provide: QueryRunnerFactory,
        useValue: mockQueryRunnerFactory,
      },
    ],
  }).compile();

  service = moduleRef.get<UsersService>(UsersService);
});

/** test suite */
describe("UsersService", () => {
  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("create method", () => {
    it("should create a new user ", async () => {
      const newUserDto = {
        name: "Teste1",
        email: "teste1@example.com",
        password: "123456",
        licenseNum: "123456",
        role: "role",
      };

      const user = await service.create(newUserDto);
      expect(user).toBeDefined();
      expect(user).toEqual({ ...newUserDto, id: 2 });
    });

    it("should throw an error if email already exists", async () => {
      await expect(service.create(mockCreateUserDto)).rejects.toThrowError(
        "Email already exists"
      );
    });
  });

  describe("findAll method", () => {
    it("should return an array of users", async () => {
      const users = await service.findAll();
      expect(users).toBeDefined();
      expect(users).toEqual(mockUsers);
      expect(users).toHaveLength(mockUsers.length);
    });
  });

  describe("findOne method", () => {
    it("should find a user by id", async () => {
      const userById = await service.findOne({ id: 1 });

      expect(userById).toBeDefined();
      expect(userById).toEqual({ ...mockCreateUserDto, id: 1 });
    });

    it("should find a user by email", async () => {
      const userByEmail = await service.findOne({
        email: mockCreateUserDto.email,
      });

      expect(userByEmail).toBeDefined();
      expect(userByEmail).toEqual({ ...mockCreateUserDto, id: 1 });
    });

    it("should return null if user is not found", async () => {
      const user = await service.findOne({ id: 2 });
      expect(user).toBeNull();
    });
  });
});
