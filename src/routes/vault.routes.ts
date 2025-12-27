import { Router } from "express";
import { auth } from "../middlewares/auth";
import { getVaultStatus } from "../controllers/vault/vaultStatus.controller";
import { vaultSetUp } from "../controllers/vault/vaultSetup.controller";
import { unlockVault } from "../controllers/vault/vaultUnlock.controller";
import { lockVault } from "../controllers/vault/vaultLock.controller";


const router = Router();

router.get("/status",auth,getVaultStatus);
router.post("/setup",auth,vaultSetUp);
router.post("/unlock",auth,unlockVault);
router.post("/lock",auth,lockVault);

export default router;