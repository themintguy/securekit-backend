// utils/jwtCookies.ts
import jwt from "jsonwebtoken";
import { Response } from "express";

export const issueAuthCookies = (res: Response, userId: string) => {
  const accessToken = jwt.sign(
    { sub: userId },
    process.env.JWT_ACCESS_SECRET!,
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign(
    { sub: userId },
    process.env.JWT_REFRESH_SECRET!,
    { expiresIn: "7d" }
  );

  res.cookie("access_token", accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
  });

  res.cookie("refresh_token", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
  });
};
