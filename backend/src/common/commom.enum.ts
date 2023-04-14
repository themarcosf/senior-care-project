export class ExceptionMessages {
  static USER_NOT_FOUND = "User not found";
  static INVALID_CREDENTIALS = "Invalid credentials";
}

export class Constants {
  static Auth = {
    PASSPORT_STRATEGY: "local",
    JWT_SECRET: "secret",
    JWT_EXPIRESIN: "1h",
    JWT_AUTHGUARD: "jwt",
    IS_PUBLIC_KEY: "isPublic",
    ADDR: "api/v1/auth",
    SIGNUP: "signup",
    SIGNIN: "signin",
    SIGNOUT: "signout",
    PROFILE: "profile",
  };

  static MedicalProgression = {
    ADDR: "api/v1/med-prog",
  };
}
