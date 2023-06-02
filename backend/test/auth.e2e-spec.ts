/** nestjs */
import { Reflector } from "@nestjs/core";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication, ClassSerializerInterceptor } from "@nestjs/common";

/** modules */
import { AuthModule } from "../src/auth/auth.module";
import { UsersModule } from "../src/users/users.module";
import { MedicalProgressionModule } from "../src/medical-progression/medical-progression.module";

/** dependencies */
import { rm } from "fs";
import * as request from "supertest";

import { Api } from "../src/auth/common/common.enum";
import { SigninDto } from "../src/auth/dto/signin.dto";
import { PassportJwt } from "../src/auth/auth.controller";
import { CreateUserDto } from "../src/users/dto/create-user.dto";
////////////////////////////////////////////////////////////////////////////////

// global test variables
let app: INestApplication;
let jwt: PassportJwt;

// mock data
const mockSigninDto: SigninDto = {
  email: "john.doe@example.com",
  password: "123456",
};

const mockCreateUserDto: CreateUserDto = {
  ...mockSigninDto,
  name: "John Doe",
  licenseNum: "SP0012",
  role: "physician",
};

/** setup */
beforeAll(async () => {
  const moduleRef: TestingModule = await Test.createTestingModule({
    imports: [
      UsersModule,
      AuthModule,
      MedicalProgressionModule,
      ConfigModule.forRoot({
        cache: true,
        isGlobal: true,
      }),
      TypeOrmModule.forRoot({
        type: "sqlite",
        database: "test.sqlite",
        autoLoadEntities: true,
        synchronize: true,
      }),
    ],
  }).compile();

  app = moduleRef.createNestApplication();

  // set global serialization
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  await app.init();
});

/** test suite */
describe("AuthController (e2e)", () => {
  it("/POST auth/signup : should sign up new user", () => {
    return request(app.getHttpServer())
      .post(`/${Api.ADDR}/${Api.SIGNUP}`)
      .send(mockCreateUserDto)
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty("access_token");
      });
  });

  it("/POST auth/signin : should sign in existing user", () => {
    return request(app.getHttpServer())
      .post(`/${Api.ADDR}/${Api.SIGNIN}`)
      .send(mockSigninDto)
      .expect(200)
      .expect((res) => {
        jwt = res.body;
        expect(res.body).toHaveProperty("access_token");
      });
  });

  it("/GET auth/profile : should retrieve user profile", () => {
    return request(app.getHttpServer())
      .get(`/${Api.ADDR}/${Api.PROFILE}`)
      .set("Authorization", `Bearer ${jwt.access_token}`)
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty("name");
        expect(res.body).toHaveProperty("role");
        expect(res.body).toHaveProperty("email");
        expect(res.body).toHaveProperty("entityName");
        expect(res.body).toHaveProperty("licenseNum");
      });
  });

  it("/GET auth/profile : should not return user sensitive data", () => {
    return request(app.getHttpServer())
      .get(`/${Api.ADDR}/${Api.PROFILE}`)
      .set("Authorization", `Bearer ${jwt.access_token}`)
      .expect(200)
      .expect((res) => {
        expect(res.body).not.toHaveProperty("id");
        expect(res.body).not.toHaveProperty("version");
        expect(res.body).not.toHaveProperty("password");
        expect(res.body).not.toHaveProperty("isActive");
        expect(res.body).not.toHaveProperty("createdAt");
        expect(res.body).not.toHaveProperty("updatedAt");
        expect(res.body).not.toHaveProperty("deletedAt");
        expect(res.body).not.toHaveProperty("deletedAt");
      });
  });
});

/** teardown */
afterAll(async () => {
  // remove test database
  rm("test.sqlite", (err) => {
    if (err) throw err;
  });

  await app.close();
});
