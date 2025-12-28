import { Response } from "express";
import { catchAsync } from "../../middlewares/catchAsync";
import type { AuthRequest } from "../../middlewares/auth";
import { updateFileSchema } from "../../schemas/updateFile.schema";
import { CustomError } from "../../utils/CustomError.util";
import { pool } from "../../config/db";


export const updateFileMetadata = catchAsync(async (req:AuthRequest,res:Response)=>{
    const userId = req.user!.id;
    const fileId = req.params.id;

    const parsed = updateFileSchema.safeParse(req.body);

    if(!parsed.success){
        throw new CustomError("Invalid input",400);
    }

    const {original_name} = parsed.data;


    const result = await pool.query(
        `UPDATE files SET original_name = $1
        WHERE id = $2 AND user_id = $3 AND deleted_at IS NULL
        RETURNING id`,[original_name,fileId,userId]
    );

      if (result.rowCount === 0) {
        throw new CustomError("File not found", 404);
      }

      res.json({
        status: "success",
        message: "File updated",
      });


})