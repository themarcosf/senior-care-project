export enum Auth {
  PASSPORT_STRATEGY = "local",
  JWT_SECRET = "secret",
  JWT_EXPIRESIN = "1h",
  JWT_AUTHGUARD = "jwt",
  IS_PUBLIC_KEY = "isPublic",
}

export enum Api {
  ADDR = "api/v1/auth",
  SIGNUP = "signup",
  SIGNIN = "signin",
  SIGNOUT = "signout",
  PROFILE = "profile",
}
