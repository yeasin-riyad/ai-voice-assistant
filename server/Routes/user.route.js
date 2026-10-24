import express from "express";
import isAuth from "../Middleware/isAuth.js";
import { getCurrentUser, saveAssistant } from "../Controllers/user.controller.js";

const router = express.Router();

router.get("/current-user",isAuth,getCurrentUser);
router.put("/save-assistant",isAuth,saveAssistant);


export default router;
