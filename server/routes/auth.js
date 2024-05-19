import express from "express";
import { signup, login, logout, changePassword, resendVerificationCode, verifyAccount } from "../controllers/auth.js";
import { verifyJWT } from "../middleware/auth.js";

const router = express.Router();

router.post("/log-in", login);
router.post("/sign-up", signup);
router.post("/log-out", logout);

router.patch("/change-password", verifyJWT, changePassword);
router.patch("/verify", verifyJWT, verifyAccount);
router.post("/resend-verification-code", verifyJWT, resendVerificationCode);


// router.patch("/restore-password", restorePassword); //code is sent to email, user inputs the code, user inputs new password, done
// router.patch("/change-email", changeEmail); //user inputs new email, verify is called, done
// router.patch("/change-password", changePassword); //user inputs old password, user inputs new password + new password confirmation, done

// router.patch("/verify", verify); //the code is sent to email, user verifies their email by providing the code, done

export default router;