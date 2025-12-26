import { Request, Response } from "express";
import { verifyAccessToken, signAccessToken } from "../utils/jwt.util";
import { CustomError } from "../utils/CustomError.util";
import { catchAsync } from "../middlewares/catchAsync";

export const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const refreshToken = req.cookies?.refresh_token;

  if (!refreshToken) {
    throw new CustomError("Unauthorized", 401);
  }

  const payload = verifyAccessToken(refreshToken);

  const newAccessToken = signAccessToken({
    sub: payload.sub,
    email: payload.email ?? "",
  });

  res.cookie("access_token", newAccessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 10 * 60 * 1000,
  });

  res.json({
    status: "success",
  });
});
