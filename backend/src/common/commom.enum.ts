export class ExceptionMessages {
  static USER_NOT_FOUND = "User not found";
  static INVALID_CREDENTIALS = "Invalid credentials";
}

export class Constants {
  static Auth = {
    PASSPORT_STRATEGY: "local",
    JWT_SECRET: "secret",
    JWT_EXPIRESIN: "60s",
    JWT_AUTHGUARD: "jwt",
    IS_PUBLIC_KEY: "isPublic",
  };

  static DB = {};

  static API = {
    ADDR: "api/v1/auth",
    SIGNUP: "signup",
    SIGNIN: "signin",
    SIGNOUT: "signout",
    PROFILE: "profile",
  };
}
