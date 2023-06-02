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

import { Api as AuthApi } from "../src/auth/common/common.enum";
import { Api as ProgTypeApi } from "../src/progression-type/common/common.enum";
import { SigninDto } from "../src/auth/dto/signin.dto";
import { PassportJwt } from "../src/auth/auth.controller";
import { CreateUserDto } from "../src/users/dto/create-user.dto";
import { ProgressionTypeModule } from "../src/progression-type/progression-type.module";
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
      ProgressionTypeModule,
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

  // create test user
  await request(app.getHttpServer())
    .post(`/${AuthApi.ADDR}/${AuthApi.SIGNUP}`)
    .send(mockCreateUserDto)
    .then((res) => (jwt = res.body));
});

/** test suite */
describe("Progression Type (e2e)", () => {
  it("should create a progression type", async () => {
    await request(app.getHttpServer())
      .post(`/${ProgTypeApi.ADDR}`)
      .set("Authorization", `Bearer ${jwt.access_token}`)
      .send({
        description: "Test Progression Type Description",
      })
      .expect(201)
      .expect((res) => {
        const { description, toggleClinicalStatus } = res.body;
        expect(description).toBeDefined();
        expect(toggleClinicalStatus).toBeDefined();
      });
  });

  it("should create a progression type related to a user", async () => {
    await request(app.getHttpServer())
      .post(`/${ProgTypeApi.ADDR}`)
      .set("Authorization", `Bearer ${jwt.access_token}`)
      .send({
        description: "Test Progression Type Description",
      })
      .expect(201)
      .expect((res) => {
        const { __createdBy__ } = res.body;
        expect(__createdBy__).toBeDefined();
        expect(__createdBy__.name).toBe(mockCreateUserDto.name);
      });
  });

  it("should create a progression type with falsy toggleClinicalStatus", async () => {
    await request(app.getHttpServer())
      .post(`/${ProgTypeApi.ADDR}`)
      .set("Authorization", `Bearer ${jwt.access_token}`)
      .send({
        description: "Test Progression Type Description",
      })
      .expect(201)
      .expect((res) => {
        const { description, toggleClinicalStatus } = res.body;
        expect(description).toBeDefined();
        expect(toggleClinicalStatus).toBeFalsy();
      });
  });

  it("should create a progression type with truthy toggleClinicalStatus", async () => {
    await request(app.getHttpServer())
      .post(`/${ProgTypeApi.ADDR}`)
      .set("Authorization", `Bearer ${jwt.access_token}`)
      .send({
        description: "Test Progression Type Description",
        toggleClinicalStatus: true,
      })
      .expect(201)
      .expect((res) => {
        const { description, toggleClinicalStatus } = res.body;
        expect(description).toBeDefined();
        expect(toggleClinicalStatus).toBeTruthy();
      });
  });

  it("should get all progression types", async () => {
    await request(app.getHttpServer())
      .get(`/${ProgTypeApi.ADDR}`)
      .set("Authorization", `Bearer ${jwt.access_token}`)
      .expect(200)
      .expect((res) => expect(res.body.length).toBeGreaterThan(0));
  });

  it("should get a progression type by id", async () => {
    await request(app.getHttpServer())
      .get(`/${ProgTypeApi.ADDR}/1`)
      .set("Authorization", `Bearer ${jwt.access_token}`)
      .expect(200)
      .expect((res) => expect(res.body).toBeDefined());
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
