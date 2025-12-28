import { Response, NextFunction } from "express";
import type { AuthRequest } from "./auth";
import { getVaultKey } from "../vault/vaultState";
import { CustomError } from "../utils/CustomError.util";



export const vault = (req: AuthRequest , res: Response,next: NextFunction)=>{
    const userId = req.user!.id;
    const key = getVaultKey(userId);


    if (!key) {
      throw new CustomError("Vault locked or not initialized", 403);
    }

    (req as any).vaultKey = key;

    next();


}