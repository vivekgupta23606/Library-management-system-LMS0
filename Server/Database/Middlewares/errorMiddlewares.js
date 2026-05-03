class ErrorHndler extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}

export const errorMiddleware = (err, req, res, next) => {
    err.message = err.message || "Internal Server Error";
    err.statusCode = err.statusCode || 500;
    
    // CastError - Invalid ObjectId
    if (err.name === "CastError") {
        const statusCode = 400;
        const message = `Invalid ${err.path}: ${err.value}. Please check the ID format.`;
        err = new ErrorHndler(message, statusCode);
    }
    
    // Duplicate key error
    if (err.code === 11000) {
        const statusCode = 400;
        const message = `Duplicate Field Value Entered`;
        err = new ErrorHndler(message, statusCode);
    }
    
    // JWT errors
    if (err.name == "JsonWebTokenError") {
        const statusCode = 400;
        const message = `Json Web Token is invalid. Try again.`;
        err = new ErrorHndler(message, statusCode);
    }
    
    if (err.name == "TokenExpiredError") {
        const statusCode = 400;
        const message = `Json Web Token is expired. Try again`;
        err = new ErrorHndler(message, statusCode);
    }
    
    const errorMessage = err.errors ? Object.values(err.errors).map(error => error.message).join("") : err.message;
    
    return res.status(err.statusCode).json({
        success: false,
        message: errorMessage
    });
};

export default ErrorHndler;