import express from "express";
import { signup, login, logout, changePassword, sendVerificationCode, verifyAccount, deleteAccount, confirmPasswordReset, resetPassword, changeEmail } from "../controllers/auth.js";
import { verifyJWT } from "../middleware/auth.js";

const router = express.Router();

router.post("/log-in", login);
router.post("/sign-up", signup);
router.post("/log-out", logout);
router.post("/send-verification-code", sendVerificationCode);

router.patch("/change-password", verifyJWT, changePassword);
router.patch("/verify", verifyJWT, verifyAccount);
router.patch("/confirm-password-reset", confirmPasswordReset);
router.patch("/reset-password", resetPassword);
router.patch("/change-email", verifyJWT, changeEmail);


router.delete("/account", verifyJWT, deleteAccount);

export default router;