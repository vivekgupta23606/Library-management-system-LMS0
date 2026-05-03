// routes/userRouter.js - User management routes

import express from "express";
import { getAllUsers, registerNewAdmin } from '../controllers/userController.js';
import { isAuthenticated, isAuthorized } from '../Database/Middlewares/authMiddlewares.js';

const router = express.Router();

// Admin only routes
router.get("/all", isAuthenticated, isAuthorized("Admin"), getAllUsers);
router.post("/add/new-admin", isAuthenticated, isAuthorized("Admin"), registerNewAdmin);

export default router;