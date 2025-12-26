import { Router } from "express";
import { signup } from "../controllers/signup.controller";
import { verifyEmail } from "../controllers/auth.controller";
import { login } from "../controllers/login.controller";
import { refreshToken } from "../controllers/refresh.controller";
import { auth } from "../middlewares/auth";
import { logout } from "../controllers/logout.controller";
import { resendVerification } from "../controllers/resendverify.controller";
import { signupLimiter, loginLimiter, resendLimiter, refreshLimiter,
} from "../middlewares/rateLimit";

const router = Router();

router.get("/verify", verifyEmail);


router.post("/signup", signupLimiter, signup);
router.post("/login", loginLimiter, login);
router.post("/resend-verification", resendLimiter, resendVerification);
router.post("/refresh", refreshLimiter, refreshToken);

router.post("/logout", auth, logout);

export default router;
