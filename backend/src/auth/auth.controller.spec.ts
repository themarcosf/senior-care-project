/**
 * IMPORTANT CAVEAT ABOUT TESTING CONTROLLERS
 *
 * controllers should not have complex logic so tests should be really simple
 * all programming and business logic should be implemented elsewhere
 */

/** nestjs */
// import { JwtService } from "@nestjs/jwt";
import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";

/** providers */
import { AppModule } from "../app.module";
import { LocalStrategy } from "./local.strategy";
import { AuthController } from "./auth.controller";
import { UsersService } from "../users/users.service";

/** dependencies */
import * as request from "supertest";
// import { Constants } from "./enums/constants.enum";
////////////////////////////////////////////////////////////////////////////////

/** providers instances */
let app: INestApplication;
let controller: AuthController;
let usersService: UsersService;
let localStrategy: LocalStrategy;

/** mock variables */
const mockSigninDto = {
  email: "john.doe@example.com",
  password: "password",
};

const mockCreateUserDto = {
  ...mockSigninDto,
  name: "John Doe",
  photo: "image1.jpg",
  role: "user",
};

// const mockJwtService = new JwtService({
//   secret: Constants.JWT_SECRET,
//   signOptions: { expiresIn: Constants.JWT_EXPIRESIN },
// });

beforeAll(async () => {
  // localStrategy = <LocalStrategy>{
  //   validate: (body: any) => {
  //     const jwt = mockJwtService.sign({ id: 1, email: "" });

  //     return [{ ...mockCreateUserDto, id: 1 }, jwt];
  //   },
  // };

  usersService = {
    create: (body: any) => {
      return { ...mockCreateUserDto, id: 1 };
    },
  } as UsersService;

  const module: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
    controllers: [AuthController],
    providers: [
      { provide: LocalStrategy, useValue: localStrategy },
      { provide: UsersService, useValue: usersService },
    ],
  }).compile();

  app = module.createNestApplication();
  await app.init();

  controller = module.get<AuthController>(AuthController);
});

afterAll(async () => {
  await app.close();
});

/** test suite */
describe("AuthController", () => {
  let jwt: string | undefined;

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("Signup method", () => {
    it("should return user data according to OutboundUserDto", async () => {
      const response = await request(app.getHttpServer())
        .post("/api/v1/auth/signup")
        .send(mockCreateUserDto);
      jwt = response.header["set-cookie"][0].split(";")[0].split("=")[1];

      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        photo: mockCreateUserDto.photo,
        firstName: mockCreateUserDto.name.split(" ")[0],
      });
    });

    it("should return JSON web token as cookie", () => {
      expect(jwt).toBeDefined();

      jwt = undefined;
    });

    it("should return error if user already exists", () => {
      console.log(
        "TO BE IMPLEMENTED: should return error if user already exists"
      );
    });
  });

  describe("Signin method", () => {
    it("should return user data according to OutboundUserDto", async () => {
      const response = await request(app.getHttpServer())
        .post("/api/v1/auth/signin")
        .send(mockSigninDto);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        photo: mockCreateUserDto.photo,
        firstName: mockCreateUserDto.name.split(" ")[0],
      });

      jwt = response.header["set-cookie"][0].split(";")[0].split("=")[1];
    });

    it("should return JSON web token as access_token", () => {});
    it("should fail if token is expired", () => {});

    it("should return error if user credentials are invalid", () => {
      console.log(
        "TO BE IMPLEMENTED: should return error if user credentials are invalid"
      );
    });
  });

  describe("Signout method", () => {
    it("should return empty response", async () => {
      const response = await request(app.getHttpServer())
        .get("/api/v1/auth/signout")
        .auth(`jwt=${jwt}`, {
          type: "bearer",
        });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({});

      jwt = response.headers["set-cookie"][0].split(";")[0].split("=")[1];
    });

    it("should clear JSON web token cookie", async () => {
      expect(jwt).toBe("");
    });
  });
});
