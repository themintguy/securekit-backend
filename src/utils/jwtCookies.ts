import jwt from "jsonwebtoken";
import { Response } from "express";

export const issueAuthCookies = (res: Response, userId: string) => {
  const accessSecret = process.env.JWT_SECRET;
  const refreshSecret = process.env.JWT_REFRESH_SECRET;

  if (!accessSecret || !refreshSecret) {
    throw new Error("JWT secrets are not configured");
  }

  const accessToken = jwt.sign(
    { sub: userId },
    accessSecret,
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign(
    { sub: userId },
    refreshSecret,
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
