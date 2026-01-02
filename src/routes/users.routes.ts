import { Router } from "express";
import { auth } from "../middlewares/auth";
import { getMe } from "../controllers/users/getMe.controller";

const router = Router();

router.get("/me", auth, getMe);

export default router;
