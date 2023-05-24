/** nestjs */
import { Test, TestingModule } from "@nestjs/testing";

/** controllers */
import { AuthController } from "./auth.controller";

/** providers */
import { AuthService } from "./auth.service";
import { UsersService } from "../users/users.service";

/** dependencies */
import { PassportRequest } from "./auth.controller";

////////////////////////////////////////////////////////////////////////////////

// global test variables
let controller: AuthController;

// mock data
const mockCreateUserDto = {
  name: "John Doe",
  email: "john.doe@example.com",
  password: "123456",
  licenseNum: "123456",
  role: "role",
};

/** setup */
beforeAll(async () => {
  // mock implementation of login method
  const mockAuthService: Partial<AuthService> = {
    login: jest.fn().mockImplementation(() => {
      return { access_token: "jwt-token" };
    }),
  };

  // mock implementation of create method
  const mockUsersService: Partial<UsersService> = {
    create: jest.fn().mockImplementation(() => {
      return { ...mockCreateUserDto, id: 1 };
    }),
  };

  // initialize test module
  const moduleRef: TestingModule = await Test.createTestingModule({
    controllers: [AuthController],
    providers: [
      { provide: UsersService, useValue: mockUsersService },
      { provide: AuthService, useValue: mockAuthService },
    ],
  }).compile();

  controller = moduleRef.get<AuthController>(AuthController);
});

/** test suite */
describe("AuthController", () => {
  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("signup method", () => {
    it("should return a jwt token", async () => {
      await expect(controller.signup(mockCreateUserDto)).resolves.toEqual({
        access_token: "jwt-token",
      });
    });
  });

  describe("signin method", () => {
    it("should return a jwt token", async () => {
      await expect(
        controller.signin({
          user: { ...mockCreateUserDto, id: 1 },
        } as PassportRequest)
      ).resolves.toEqual({
        access_token: "jwt-token",
      });
    });

    it("should throw an error if user is not found", async () => {
      await expect(
        controller.signin({} as PassportRequest)
      ).rejects.toThrowError("User not found");
    });
  });

  describe("profile method", () => {
    it("should return a user profile", () => {
      const user = { ...mockCreateUserDto, id: 1 };
      expect(
        controller.profile(
          { id: 1 } as Record<string, any>,
          { user } as PassportRequest
        )
      ).resolves.toEqual(user);
    });

    it("should throw an error if user is not found", () => {
      expect(
        controller.profile(
          { id: 1 } as Record<string, any>,
          {} as PassportRequest
        )
      ).rejects.toThrowError("User not found");
    });
  });
});
