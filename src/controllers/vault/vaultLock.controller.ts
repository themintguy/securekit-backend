import { Response } from "express";
import { catchAsync } from "../../middlewares/catchAsync";
import type { AuthRequest } from "../../middlewares/auth";
import { clearVaultkey } from "../../vault/vaultState";


export const lockVault = catchAsync(async(req:AuthRequest , res:Response)=>{
    const userId = req.user!.id;

    clearVaultkey(userId);

    res.json({
        status:"sucess",
        message:"vault locked",
    });

})