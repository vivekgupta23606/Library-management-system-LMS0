import express from "express";  
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import cors from 'cors'
import { connectDB } from "./Database/db.js";
import { errorMiddleware } from "./Database/Middlewares/errorMiddlewares.js";
import authRouter from "./routes/authRouter.js";
import bookRouter from './routes/bookRouter.js';
import borrowRouter from './routes/borrowRouter.js'
import userRouter from './routes/userRouter.js'
import expressFileupload from 'express-fileupload'
import { notifyUsers } from "./services/notifyUsers.js";
import { removeUnverifiedAccounts } from "./services/removeUnverifiedAccount.js";

const app = express();

config({ path: "./config/config.env" });

//  CORS configuration
app.use(cors({
    origin: [
        "http://localhost:5173",
        "https://extensive-treaty-lexmark-rid.trycloudflare.com"
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
}));

//  Body parsers - IMPORTANT: These must come BEFORE file upload
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//  File upload middleware - MUST be before routes
app.use(expressFileupload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    debug: false, // Set to true for debugging
    abortOnLimit: true,
    createParentPath: true
}));

//  Logging middleware
app.use((req, res, next) => {
    console.log(`📨 ${req.method} ${req.url} - Origin: ${req.headers.origin || 'unknown'}`);
    next();
});

//  Routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/book", bookRouter);
app.use("/api/v1/borrow", borrowRouter);
app.use("/api/v1/user", userRouter);

//  Services and Database
notifyUsers();
removeUnverifiedAccounts();
connectDB();

//  Error middleware (should be last)
app.use(errorMiddleware);

export default app;