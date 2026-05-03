import { catchAsyncErrors } from "../Database/Middlewares/catchAsyncErrors.js";
import ErrorHndler from "../Database/Middlewares/errorMiddlewares.js";
import { Book } from '../models/bookModel.js'

export const addBook = catchAsyncErrors(async(req,res,next)=>{
    const {title, author, description, price, quantity, course, branch, semester, year, subject} = req.body;
    
    if(!title || !author || !description || !price || !quantity || !course || !branch || !subject){
        return next(new ErrorHndler("Please fill all fields",400));
    }
    
    const bookData = {
        title, author, description,
        price: Number(price),
        quantity: Number(quantity),
        course, branch, subject
    };
    
    if (course === "Diploma" || course === "B.Pharma" || course === "M.Pharma") {
        if (!year) {
            return next(new ErrorHndler("Please select year",400));
        }
        bookData.year = Number(year);
        bookData.semester = null;
    } else {
        if (!semester) {
            return next(new ErrorHndler("Please select semester",400));
        }
        bookData.semester = Number(semester);
        bookData.year = null;
    }
    
    const book = await Book.create(bookData);
    
    res.status(201).json({
        success: true,
        message: "Book added successfully.",
        book,
    });
});

export const getAllBook = catchAsyncErrors(async(req,res,next)=>{
    const books = await Book.find();
    res.status(200).json({
        success: true,
        books
    })
});

export const deleteBook = catchAsyncErrors(async(req,res,next)=>{
    const {id} = req.params;
    const book = await Book.findById(id)
    if (!book){
        return next(new ErrorHndler("Book not found.",404))
    }
    await book.deleteOne();
    res.status(200).json({
        success: true,
        message: "Book deleted successfully."
    })
});