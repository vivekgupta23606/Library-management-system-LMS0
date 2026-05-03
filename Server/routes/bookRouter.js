// routes/bookRouter.js - Book management routes

import express from "express";
import { isAuthenticated, isAuthorized } from "../Database/Middlewares/authMiddlewares.js";
import { addBook, deleteBook, getAllBook } from '../controllers/bookController.js';

const router = express.Router();

// Admin only routes
router.post("/admin/add", isAuthenticated, isAuthorized("Admin"), addBook);
router.delete("/delete/:id", isAuthenticated, isAuthorized("Admin"), deleteBook);

// Both Admin and User can view books
router.get("/all", isAuthenticated, getAllBook);

export default router;