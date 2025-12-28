import { Response } from "express";
import { catchAsync } from "../../middlewares/catchAsync";
import type { AuthRequest } from "../../middlewares/auth";
import { pool } from "../../config/db";
import { CustomError } from "../../utils/CustomError.util";

export const deleteFile = catchAsync(async (req: AuthRequest, res: Response)=>{
    const userId = req.user!.id;
    const fileId = req.params.id;

    const result = await pool.query(
        `UPDATE files SET deleted_at = NOW()
        WHERE id = $1 AND user_id = $2
        AND deleted_at IS NULL
        RETURNING id`,[fileId,userId]
    );

     if (result.rowCount === 0) {
       throw new CustomError("File not found", 404);
     }

     res.json({
       status: "success",
       message: "File deleted",
     });


})