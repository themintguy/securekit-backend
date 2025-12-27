import type { AuthRequest } from "../../middlewares/auth";
import { catchAsync } from "../../middlewares/catchAsync";
import { Response } from "express";
import { vaultSetupSchema } from "../../schemas/vaultsetup.schema";
import { CustomError } from "../../utils/CustomError.util";
import { pool } from "../../config/db";
import crypto from "crypto";
import { hashAnswer } from "../../utils/vaultHash.util";
import { normalize } from "../../utils/normalize.util";


export const vaultSetUp = catchAsync( async (req: AuthRequest, res:Response)=>{
    const parsed = vaultSetupSchema.safeParse(req.body);

    if(!parsed.success){
        throw new CustomError("invalid input",400);
    }


    const { ans1, ans2, ans3, pin } = parsed.data;
    const userId = req.user!.id;

    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const exists = await client.query(
            `SELECT 1 FROM vault_security WHERE user_id = $1`,[userId]
        );


        if (exists.rowCount !== null && exists.rowCount > 0) {
             throw new CustomError("Vault already initialized", 409);
        }

        const vaultsalt = crypto.randomBytes(32);

        const q1 = hashAnswer(normalize(ans1),vaultsalt);
        const q2 = hashAnswer(normalize(ans2),vaultsalt);
        const q3 = hashAnswer(normalize(ans3),vaultsalt);

        await client.query(
            `INSERT INTO vault_security (user_id, question_1_hash,question_2_hash,
            question_3_hash,vault_salt,kdf_version)
                VALUES ($1,$2,$3,$4,$5,1)`,[userId,q1,q2,q3,vaultsalt]
        );

        await client.query("COMMIT");

        res.status(200).json({
            status:"success",
            message:"vault init success",
        });
    } catch(err){
        await client.query("ROLLBACK");
        throw err;
    } finally{
        client.release();
    }


})