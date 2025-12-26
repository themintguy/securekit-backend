import { Request, Response } from "express";
import { signupSchema } from "../schemas/auth.schema";
import { hashPassword } from "../utils/hash.util";
import { generateVerificationToken } from "../utils/token.util";
import { CustomError } from "../utils/CustomError.util";
import { pool } from "../config/db";
import { catchAsync } from "../middlewares/catchAsync";
import { sendVerificationEmail } from "../utils/mailer.util.";

export const signup = catchAsync(async (req: Request, res: Response) => {
  const parsed = signupSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new CustomError("Invalid input", 400, parsed.error.flatten());
  }

  const { email, password } = parsed.data;

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const exists = await client.query(`SELECT id FROM users WHERE email = $1`, [
      email,
    ]);

    if ((exists.rowCount ?? 0) > 0) {
      throw new CustomError("Invalid credentials", 400);
    }

    const passwordHash = await hashPassword(password);
    const { token, tokenHash } = generateVerificationToken();

    const result = await client.query(
      `
      INSERT INTO users (email, password_hash, verification_token_hash, verification_expires_at)
      VALUES ($1, $2, $3, NOW() + INTERVAL '24 hours')
      RETURNING id
      `,
      [email, passwordHash, tokenHash]
    );

    await client.query("COMMIT");

  
    await sendVerificationEmail(email, token);

    res.status(201).json({
      status: "success",
      message: "Verification email sent",
    });
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
});
