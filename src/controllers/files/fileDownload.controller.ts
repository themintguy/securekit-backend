import { Response } from "express";
import { catchAsync } from "../../middlewares/catchAsync";
import type { AuthRequest } from "../../middlewares/auth";
import { pool } from "../../config/db";
import { CustomError } from "../../utils/CustomError.util";
import { getS3ObjectStream } from "../../aws/s3Download";
import { createDecryptStream } from "../../utils/decrypt.util";
import { pipeline } from "stream/promises";



export const DownloadFile = catchAsync(async (req: AuthRequest,res: Response)=>{

    const userId = req.user!.id;
    const vaultKey: Buffer = (req as any).vaultKey;
    const fileId = req.params.id;

    const result = await pool.query(
        `SELECT s3_key,original_name,mime_type,iv,auth_tag
        FROM files WHERE id = $1 
        AND user_id = $2
        AND deleted_at IS NULL`,[fileId,userId]
    );

    if (result.rowCount === 0) {
      throw new CustomError("File not found", 404);
    }

    const file = result.rows[0];

    const s3Stream = await getS3ObjectStream(file.s3_key);

    const decryptStream = createDecryptStream(vaultKey,file.iv,file.auth_tag);

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${file.original_name}"`
    );
    res.setHeader("Content-Type", file.mime_type || "application/octet-stream");

    await pipeline(s3Stream, decryptStream, res);


})