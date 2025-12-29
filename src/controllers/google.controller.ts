import { Request, Response } from "express";
import { issueAuthCookies } from "../utils/jwtCookies"

export const googleCallback = (req: Request, res: Response) => {
  const user = req.user as { id: string };

  issueAuthCookies(res, user.id);

  res.json({
    status: "success",
    message: "Google login successful",
  });
};
