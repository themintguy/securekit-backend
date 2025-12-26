import { Request, Response } from "express";

export const logout = (_req: Request, res: Response) => {
  res.clearCookie("access_token");
  res.clearCookie("refresh_token");

  res.json({ status: "success" });
};
