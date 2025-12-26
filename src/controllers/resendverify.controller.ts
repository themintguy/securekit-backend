import { Request, Response } from "express";
import { pool } from "../config/db";
import { resendVerificationSchema } from "../schemas/reverification.schema";
import { generateVerificationToken } from "../utils/token.util";
import { sendVerificationEmail } from "../utils/mailer.util.";
import { catchAsync } from "../middlewares/catchAsync";

export const resendVerification = catchAsync(
  async (req: Request, res: Response) => {
    const parsed = resendVerificationSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.json({
        status: "success",
        message: "If the account exists, a verification email has been sent",
      });
    }

    const { email } = parsed.data;

    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const result = await client.query(
        `
        SELECT id, is_verified
        FROM users
        WHERE email = $1
        `,
        [email]
      );


      if (result.rowCount === 0 || result.rows[0].is_verified) {
        await client.query("COMMIT");
        return res.json({
          status: "success",
          message: "If the account exists, a verification email has been sent",
        });
      }

      const { token, tokenHash } = generateVerificationToken();

      await client.query(
        `
        UPDATE users
        SET
          verification_token_hash = $1,
          verification_expires_at = NOW() + INTERVAL '24 hours'
        WHERE id = $2
        `,
        [tokenHash, result.rows[0].id]
      );

      await client.query("COMMIT");

      
      await sendVerificationEmail(email, token);

      res.json({
        status: "success",
        message: "If the account exists, a verification email has been sent",
      });
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  }
);
