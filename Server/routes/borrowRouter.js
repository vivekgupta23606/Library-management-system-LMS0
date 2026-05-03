// routes/borrowRouter.js - Borrow management routes

import express from "express";
import {
  borrowedBooks,
  getBookBorrowedByAdmin,
  recordBorrowedBook,
  returnBorrowedBook,
} from "../controllers/borrowController.js";
import { isAuthenticated, isAuthorized } from "../Database/Middlewares/authMiddlewares.js";

const router = express.Router();

// Admin only routes
router.post("/record-borrow-book/:id", isAuthenticated, isAuthorized("Admin"), recordBorrowedBook);
router.get("/borrowed-books-by-users", isAuthenticated, isAuthorized("Admin"), getBookBorrowedByAdmin);
router.put("/return-borrowed-book/:bookId", isAuthenticated, isAuthorized("Admin"), returnBorrowedBook);

// User route
router.get("/my-borrowed-books", isAuthenticated, borrowedBooks);

export default router;