import { Request, Response, NextFunction } from "express";
import { CustomError } from "../utils/CustomError.util";

export const errHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err);

  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({
      status: "error",
      message: err.message,
      details: err.details || null,
    });
  }

  res.status(500).json({
    status: "error",
    message: "Internal Server Error",
  });
};
