import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt.util";
import { CustomError } from "../utils/CustomError.util";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
  } | any;
}

export const auth = (req: AuthRequest, _res: Response, next: NextFunction) => {
  const token = req.cookies?.access_token;

  if (!token) {
    throw new CustomError("Unauthorized", 401);
  }

  const payload = verifyAccessToken(token);

  req.user = {
    id: payload.sub,
    email: payload.email,
  };

  next();
};
