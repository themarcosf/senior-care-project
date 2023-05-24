/** nestjs */
import { JwtService } from "@nestjs/jwt";
import { Test, TestingModule } from "@nestjs/testing";

/** dependencies */
import { AuthService } from "./auth.service";
import { User } from "../users/entities/user.entity";
import { UsersService } from "../users/users.service";
////////////////////////////////////////////////////////////////////////////////

// global test variables
let service: AuthService;

// mock data
const mockSignInDto = {
  email: "john.doe@example.com",
  password: "123456",
};

const mockUsers = [{ ...mockSignInDto, id: 1 }];

/** setup */
beforeAll(async () => {
  // mock implementation of sign method
  const mockJwtService: Partial<JwtService> = {
    sign: jest.fn().mockImplementation(() => {
      return "jwt-token";
    }),
  };

  // mock implementation of findOne method
  const mockUsersService: Partial<UsersService> = {
    findOne: jest.fn().mockImplementation((args) => {
      return mockUsers.find((user) => user.email === args.email);
    }),
  };

  // initialize test module
  const moduleRef: TestingModule = await Test.createTestingModule({
    providers: [
      AuthService,
      { provide: JwtService, useValue: mockJwtService },
      { provide: UsersService, useValue: mockUsersService },
    ],
  }).compile();

  service = moduleRef.get<AuthService>(AuthService);
});

/** test suite */
describe("UsersService", () => {
  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("validateUser method", () => {
    it("should return a user if the email and password are valid", async () => {
      const user = await service.validateUser(
        mockSignInDto.email,
        mockSignInDto.password
      );
      expect(user).toEqual(mockUsers[0]);
    });

    it("should return null if the email is invalid", async () => {
      const user = await service.validateUser(
        "invalid@example.com",
        mockSignInDto.password
      );
      expect(user).toBeNull();
    });
  });

  describe("login method", () => {
    it("should return an object with an access_token property", async () => {
      const response = await service.login(mockUsers[0] as User);
      expect(response).toHaveProperty("access_token");
      expect(response.access_token).toEqual("jwt-token");
    });
  });
});
