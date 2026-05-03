// routes/authRouter.js - Authentication routes

import express from 'express';
import { 
  register, 
  verifyOTP, 
  login, 
  logout, 
  getUser, 
  forgetPassword, 
  resetpassword, 
  updatepassword 
} from '../controllers/authController.js';
import { isAuthenticated } from '../Database/Middlewares/authMiddlewares.js';

const router = express.Router();

router.post("/register", register);
router.post("/verify-otp", verifyOTP);
router.post("/login", login);
router.get("/logout", isAuthenticated, logout);
router.get("/me", isAuthenticated, getUser);
router.post("/password/forgot", forgetPassword);
router.put("/password/reset/:token", resetpassword);
router.put("/password/update", isAuthenticated, updatepassword);

export default router;