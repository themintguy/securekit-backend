import {  Response } from "express";
import { catchAsync } from "../../middlewares/catchAsync";
import type { AuthRequest } from "../../middlewares/auth";
import { pool } from "../../config/db";
import { isVaultunlocked } from "../../vault/vaultState";



export const getVaultStatus = catchAsync(async (req: AuthRequest , res: Response)=>{
    const userId = req.user!.id;

    const result = await pool.query(
            `
            SELECT 1 FROM vault_security WHERE user_id = $1
            `,
            [userId]
    );

    const exists = (result?.rowCount ?? 0) > 0;
    const unlocked = exists && isVaultunlocked(userId);

    res.json({
        exists,
        unlocked,
    });

})