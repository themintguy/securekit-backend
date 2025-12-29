import { Response } from "express";
import { catchAsync } from "../../middlewares/catchAsync";
import type { AuthRequest } from "../../middlewares/auth";
import { CustomError } from "../../utils/CustomError.util";
import { pool } from "../../config/db";
import bcrypt from "bcryptjs";


export const useRecoveryCode = catchAsync(async (req: AuthRequest, res: Response)=>{
    const userId = req.user!.id;
    const {code} = req.body;

    if (!code || typeof code !== "string") {
      throw new CustomError("Invalid recovery code", 400);
    }

    const result = await pool.query(
        `SELECT id , code_hash FROM recovery_codes
        WHERE user_id = $1
        AND is_used = false`,[userId]
    );

    for(const row of result.rows){
        const match = await bcrypt.compare(code,row.code_hash.toString());

        if(match) {
            await pool.query(
                `UPDATE recovery_codes 
                SET is_used = true,
                used_at = NOW()
                WHERE id = $1`,[row.id]
            );

            await pool.query(
                `DELETE FROM vault_security
                WHERE user_id = $1`,[userId]
            );

            res.json({
              status: "success",
              message: "Recovery code accepted. You may now reset your vault.",
            });
            return;
        }
    }

    throw new CustomError("Invalid recovery code", 400);



})