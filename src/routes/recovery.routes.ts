import { Router } from "express";
import { auth } from "../middlewares/auth";
import { generateRecoveryCodes } from "../controllers/recovery/generate.controller";
import { getRecoveryStatus } from "../controllers/recovery/getRecoveryStatus.controller";
import { useRecoveryCode } from "../controllers/recovery/useRecoveryCode";
const router = Router();


router.post("/usecode",auth, useRecoveryCode);
router.post("/generate", auth, generateRecoveryCodes);
router.get("/status", auth, getRecoveryStatus);


export default router;
