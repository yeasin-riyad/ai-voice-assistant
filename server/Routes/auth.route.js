
import express from "express";
import { googleAuth, logOut } from "../Controllers/auth.controller.js";

const router = express.Router();

// Google authentication
router.post("/google", googleAuth);

// Logout
router.get("/logout", logOut);

export default router;
