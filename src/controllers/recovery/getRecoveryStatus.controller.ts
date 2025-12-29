import { Response } from "express";
import { catchAsync } from "../../middlewares/catchAsync";
import type { AuthRequest } from "../../middlewares/auth";
import { pool } from "../../config/db";


export const getRecoveryStatus = catchAsync (async (req: AuthRequest,res: Response)=>{
  const userId = req.user!.id;

  const result = await pool.query(
    `SELECT
    COUNT(*) FILTER (WHERE is_used = false) AS remaining,
    COUNT(*) FILTER (WHERE is_used = true) AS used,
    COUNT(*) as total FROM recovery_codes 
    WHERE user_id = $1`,[userId]
  );

  res.json({
    total: Number(result.rows[0].total),
    used: Number(result.rows[0].used),
    remaining: Number(result.rows[0].remaining),
  });

})