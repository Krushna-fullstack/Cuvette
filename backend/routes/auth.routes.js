import { Router } from "express";
import {
  registerUser,
  verifyEmail,
  login,
  logout,
  getMe,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middlewares/protectRoute.js";

const router = Router();

router.get("/me", protectRoute, getMe);
router.post("/register", registerUser);
router.get("/verify-email/:token", verifyEmail);
router.post("/login", login);
router.post("/logout", logout);

export default router;
