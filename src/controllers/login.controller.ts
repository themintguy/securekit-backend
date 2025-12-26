import { Request, Response } from "express";
import { pool } from "../config/db";
import { loginSchema } from "../schemas/login.schema";
import { comparePassword } from "../utils/password.util";
import { signAccessToken, signRefreshToken } from "../utils/jwt.util";
import { CustomError } from "../utils/CustomError.util";
import { catchAsync } from "../middlewares/catchAsync";

export const login = catchAsync(async (req: Request, res: Response) => {
  
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new CustomError("Invalid credentials", 400);
  }

  const { email, password } = parsed.data;

  const result = await pool.query(
    `
    SELECT id, email, password_hash, is_verified
    FROM users
    WHERE email = $1
    `,
    [email]
  );

  if (result.rowCount === 0) {
    throw new CustomError("Invalid credentials", 400);
  }

  const user = result.rows[0];

  const passwordOk = await comparePassword(password, user.password_hash);

  if (!passwordOk) {
    throw new CustomError("Invalid credentials", 400);
  }




  if (!user.is_verified) {
    throw new CustomError("Invalid credentials", 400);
  }

  const accessToken = signAccessToken({
    sub: user.id,
    email: user.email,
  });

  const refreshToken = signRefreshToken({
    sub: user.id,
  });

  res.cookie("access_token", accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 10 * 60 * 1000,
  });

  res.cookie("refresh_token", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.json({
    status: "success",
    message: "Logged in successfully",
  });
});
