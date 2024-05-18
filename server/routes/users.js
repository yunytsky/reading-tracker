import express from "express";
import {verifyJWT} from "../middleware/auth.js";
import { changeAvatar, updateCountry } from "../controllers/users.js";
import libraryRoutes from "./library.js";

const router = express.Router();

router.patch("/:userId/update-country", verifyJWT, updateCountry);
router.patch("/:userId/change-avatar", verifyJWT, changeAvatar);

// Nest library routes
router.use('/:userId/library', libraryRoutes);

export default router;