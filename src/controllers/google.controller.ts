import { Request, Response } from "express";
import { issueAuthCookies } from "../utils/jwtCookies"

export const googleCallback = (req: Request, res: Response) => {
  const user = req.user as { id: string };

  issueAuthCookies(res, user.id);

 res.redirect("https://securekit.k31.tech");
};
