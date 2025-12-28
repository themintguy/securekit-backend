    import { Response } from "express";
import { pool } from "../../config/db";
import { catchAsync } from "../../middlewares/catchAsync";
import type { AuthRequest } from "../../middlewares/auth";

export const getFileUsage = catchAsync(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;

    const result = await pool.query(
      `
      SELECT
        COALESCE(SUM(file_size_bytes), 0) AS total_bytes
      FROM files
      WHERE user_id = $1
        AND deleted_at IS NULL
      `,
      [userId]
    );

    res.json({
      total_bytes: Number(result.rows[0].total_bytes),
    });
  }
);
