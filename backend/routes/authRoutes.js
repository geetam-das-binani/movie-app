import express from "express";
import {
  register,
  login,
  logout,
  getProfileDetails,
} from "../controllers/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  validateAuthLogin,
  validateAuthRegister,
} from "../validation/authValidation.js";
const router = express.Router();

router.post("/register", validateAuthRegister, register);
router.post("/login", validateAuthLogin, login);
router.post("/logout", logout);
router.get("/profile", authMiddleware, getProfileDetails);

export default router;
