import { Response } from "express";
import { catchAsync } from "../../middlewares/catchAsync";
import type { AuthRequest } from "../../middlewares/auth";
import { pool } from "../../config/db";


export const listFiles = catchAsync(async(req: AuthRequest, res: Response)=>{
    const userId = req.user!.id;

    const result = await pool.query(
        `SELECT id, original_name,file_size_bytes,mime_type,uploaded_at
        FROM files WHERE user_id = $1
        AND deleted_at IS NULL ORDER BY uploaded_at DESC`,[userId]
    );

    res.json(result.rows);
})