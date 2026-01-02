import { Response } from "express";
import { catchAsync } from "../../middlewares/catchAsync";
import type { AuthRequest } from "../../middlewares/auth";
import { email } from "zod";


export const getMe = catchAsync( async(req: AuthRequest,res: Response)=>{
    const user = req.user;

    res.json({
        id:user.id,
        email: user.email,
    })
})