import type { AuthRequest } from "../../middlewares/auth";
import { catchAsync } from "../../middlewares/catchAsync";
import { Response } from "express";
import { vaultSetupSchema } from "../../schemas/vaultsetup.schema";
import { CustomError } from "../../utils/CustomError.util";
import { canAttemptUnlock, registerVaultFailure, setVaultkey } from "../../vault/vaultState";
import { pool } from "../../config/db";
import { deriveVaultKey, hashAnswer } from "../../utils/vaultHash.util";
import { normalize } from "../../utils/normalize.util";
import crypto from "crypto";



export const unlockVault = catchAsync(async(req: AuthRequest, res: Response)=>{

    const parsed = vaultSetupSchema.safeParse(req.body);

    if(!parsed.success){
        throw new CustomError("Invalid input",400);
    }

     const { ans1, ans2, ans3, pin } = parsed.data;
     const userId = req.user!.id;

     if (!canAttemptUnlock(userId)) {
       throw new CustomError("Vault temporarily locked. Try again later.", 429);
     }

      const result = await pool.query(
        `SELECT question_1_hash,
        question_2_hash,
        question_3_hash,
        vault_salt
      FROM vault_security
      WHERE user_id = $1
      `,
        [userId]
      );

      if (result.rowCount === 0) {
        throw new CustomError("Vault not initialized", 400);
      }

      const row = result.rows[0];
      const salt: Buffer = row.vault_salt;

      const q1 = hashAnswer(normalize(ans1), salt);
      const q2 = hashAnswer(normalize(ans2), salt);
      const q3 = hashAnswer(normalize(ans3), salt);

      const valid =
        crypto.timingSafeEqual(q1, row.question_1_hash) &&
        crypto.timingSafeEqual(q2, row.question_2_hash) &&
        crypto.timingSafeEqual(q3, row.question_3_hash);

      if (!valid) {
        registerVaultFailure(userId);
        throw new CustomError("Invalid credentials", 400);
      }

      const masterSecret = normalize(ans1) + normalize(ans2) + normalize(ans3) + pin;


    const aesKey = deriveVaultKey(masterSecret, salt);

    setVaultkey(userId, aesKey);

      res.json({
        status: "success",
        message: "Vault unlocked",
      });
})