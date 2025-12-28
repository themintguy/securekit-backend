import { Response } from "express";
import { catchAsync } from "../../middlewares/catchAsync";
import type { AuthRequest } from "../../middlewares/auth";
import { pool } from "../../config/db";
import { CustomError } from "../../utils/CustomError.util";


export const getFileMetadata = catchAsync(async (req: AuthRequest,res: Response)=>{
    const userId = req.user!.id;
    const fileId = req.params.id;

    const result = await pool.query(
        `SELECT id,original_name,file_size_bytes,mime_type,uploaded_at
        FROM files WHERE id = $1
        AND user_id = $2 
        AND deleted_at is NULL`,
        [fileId,userId]
    );

    if(result.rowCount === 0){
        throw new CustomError("file not found", 404);
    }

    res.json(result.rows[0]);

})