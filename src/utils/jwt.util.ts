import jwt from "jsonwebtoken";
import { CustomError } from "./CustomError.util";

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = "10m";

export interface JwtPayload {
  sub: string;
  email: string;
  iat: number;
  exp: number;
}

export const signAccessToken = (payload: { sub: string; email: string }) => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

export const verifyAccessToken = (token: string): JwtPayload => {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch {
    throw new CustomError("Unauthorized", 401);
  }
};

export const signRefreshToken = (payload: { sub: string }) => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "24h",
  });
};
