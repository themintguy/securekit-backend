import { Request, Response } from "express";
import crypto from "crypto";
import { pool } from "../config/db";
import { catchAsync } from "../middlewares/catchAsync";
import { CustomError } from "../utils/CustomError.util";

export const verifyEmail = catchAsync(async (req: Request, res: Response) => {
  const token = req.query.token as string;
  if (!token) {
    throw new CustomError("Invalid verification link", 400);
  }

  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

  const result = await pool.query(
    `
    UPDATE users
    SET 
      is_verified = true,
      verification_token_hash = NULL,
      verification_expires_at = NULL
    WHERE 
      verification_token_hash = $1
      AND verification_expires_at > NOW()
    RETURNING id
    `,
    [tokenHash]
  );

  if (result.rowCount === 0) {
    throw new CustomError("Verification link invalid or expired", 400);
  }

  res.json({
    status: "success",
    message: "Email verified successfully!!!",
  });
});
