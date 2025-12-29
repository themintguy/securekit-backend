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
import passport from "passport";
import { googleCallback } from "../controllers/google.controller";


const router = Router();

router.get("/verify", verifyEmail);


router.post("/signup", signupLimiter, signup);
router.post("/login", loginLimiter, login);
router.post("/resend-verification", resendLimiter, resendVerification);
router.post("/refresh", refreshLimiter, refreshToken);

router.post("/logout", auth, logout);



router.get("/google",passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);


router.get("/google/callback",passport.authenticate("google", {
    session: false,
    failureRedirect: "/auth/google/failure",
  }),
  googleCallback
);

router.get("/google/failure", (_req, res) => {
  res.status(401).json({ message: "Google authentication failed" });
});

export default router;
