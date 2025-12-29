import { Response } from "express";
import { catchAsync } from "../../middlewares/catchAsync";
import type { AuthRequest } from "../../middlewares/auth";
import { pool } from "../../config/db";
import crypto from "crypto";
import bcrypt from "bcryptjs";

const RECOVER_CODE = 8;
const BCRYPT_ROUNDS = 12;

export const generateRecoveryCodes = catchAsync(async (req:AuthRequest,res:Response)=>{
    const userId = req.user!.id;

    await pool.query(
        `DELETE FROM recovery_codes WHERE 
        user_id = $1 AND is_used = false`,[userId]
    );

    const plainCodes: string[] = [];
    const hashedCodes: string[] = [];

    for(let i =0;i< RECOVER_CODE;i++){
        const code = crypto.randomBytes(8).toString("hex");
        const hash = await bcrypt.hash(code,BCRYPT_ROUNDS);

        plainCodes.push(code);
        hashedCodes.push(hash);

    }

    const insertPromises = hashedCodes.map((hash)=> {
        pool.query(
            `INSERT INTO recovery_codes (user_id, code_hash) VALUES ($1, $2)`,
            [userId,hash]
        )
    });

    await Promise.all(insertPromises);

    res.status(201).json({
        status: "success",
        recovery_codes:plainCodes,
        warning: "Store these codes securely.they wont show again"
    })
})