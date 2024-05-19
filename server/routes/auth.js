import express from "express";
import { signup, login, logout, changePassword, sendVerificationCode, verifyAccount, deleteAccount } from "../controllers/auth.js";
import { verifyJWT } from "../middleware/auth.js";

const router = express.Router();

router.post("/log-in", login);
router.post("/sign-up", signup);
router.post("/log-out", logout);

router.patch("/change-password", verifyJWT, changePassword);
router.patch("/verify", verifyJWT, verifyAccount);
router.post("/send-verification-code", sendVerificationCode);

router.delete("/account", verifyJWT, deleteAccount);

export default router;