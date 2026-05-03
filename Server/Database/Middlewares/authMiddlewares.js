import { User } from "../../models/userModel.js";
import { catchAsyncErrors } from "./catchAsyncErrors.js";
import ErrorHndler from "./errorMiddlewares.js";
import jwt from "jsonwebtoken";

export const isAuthenticated = catchAsyncErrors(async (req, res, next) => {
    let token = req.cookies?.token;
    
    if (!token) {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.split(' ')[1];
        }
    }
    
    if (!token) {
        return next(new ErrorHndler("Please login to access this resource", 401));
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const user = await User.findById(decoded.id).select("-password");
        
        if (!user) {
            return next(new ErrorHndler("User not found. Please login again.", 401));
        }
        
        req.user = user;
        next();
    } catch (error) {
        console.error("JWT Verification Error:", error.message);
        return next(new ErrorHndler("Invalid or expired token. Please login again.", 401));
    }
});

export const isAuthorized = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new ErrorHndler(`Role: ${req.user.role} is not allowed to access this resource.`, 403));
        }
        next();
    };
};