import { Response } from "express";
import crypto from "crypto";
import mime from "mime-types";
import { catchAsync } from "../../middlewares/catchAsync";
import type { AuthRequest } from "../../middlewares/auth";
import { encryptBufferGCM } from "../../utils/encryt.util";
import { uploadToS3 } from "../../aws/s3Upload";
import { pool } from "../../config/db";

export const uploadFile = catchAsync(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    const vaultKey: Buffer = (req as any).vaultKey;

    const file = (req as any).file;
    if (!file) {
      return res.status(400).json({
        status: "error",
        message: "No file uploaded",
      });
    }

    const { encrypted, iv, authTag } = encryptBufferGCM(file.buffer, vaultKey);

    const s3ObjectId = crypto.randomUUID();
    const s3Key = `vault/${userId}/${s3ObjectId}.bin`;

    await uploadToS3(s3Key, encrypted);

    const result = await pool.query(
      `
      INSERT INTO files (
        user_id,
        s3_key,
        original_name,
        file_size_bytes,
        mime_type,
        iv,
        auth_tag
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id
      `,
      [
        userId,
        s3Key,
        file.originalname,
        file.size,
        mime.lookup(file.originalname) || "application/octet-stream",
        iv,
        authTag,
      ]
    );

    const fileId = result.rows[0].id;

    res.status(201).json({
      status: "success",
      message: "File uploaded securely",
      fileId,
    });
  }
);
