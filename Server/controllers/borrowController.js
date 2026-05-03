import mongoose from 'mongoose'; 
import { catchAsyncErrors } from "../Database/Middlewares/catchAsyncErrors.js";
import ErrorHndler from "../Database/Middlewares/errorMiddlewares.js";
import { Book } from "../models/bookModel.js";
import { Borrow } from '../models/borrowModal.js'
import { User } from "../models/userModel.js";
import { calculateFine } from "../Utils/fineCalculator.js";
import { generateBorrowConfirmationEmail, generateReturnConfirmationEmail } from "../Utils/emailTemplet.js";
import { sendEmail } from "../Utils/sendEmail.js";

export const recordBorrowedBook = catchAsyncErrors(async(req,res,next)=>{
    const {id}=req.params;
    
    if(!req.body || Object.keys(req.body).length === 0){
        return next(new ErrorHndler("Please provide user email.", 400));
    }
    
    const {email}=req.body;
    if(!email){
        return next(new ErrorHndler("Please provide user email.", 400));
    }
    
    const book=await Book.findById(id);
    if(!book){
        return next(new ErrorHndler("Book not found.",404));
    }
    
    const user=await User.findOne({
        email: email,
        accountVerified: true
    });
    
    if(!user){
        return next(new ErrorHndler("User not found.",404));   
    }
    
    if(book.quantity===0){
        return next(new ErrorHndler("Book not available.",400));   
    }
    
    const isAlreadyBorrowed = user.borrowedBooks.find(
        (b)=>b.bookId.toString()===id && b.returned === false
    );
    
    if(isAlreadyBorrowed){
        return next(new ErrorHndler("Book already borrowed.",400));   
    }

    const dueDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    
    book.quantity -= 1;
    book.availability = book.quantity > 0;
    await book.save();
    
    user.borrowedBooks.push({
        bookId: book._id,
        bookTitle: book.title,
        borrowedDate: new Date(),
        dueDate: dueDate,
        returned: false 
    });
    await user.save();
    
    await Borrow.create({
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            mobile: user.mobile || null
        },
        book: book._id,
        dueDate: dueDate,
        price: book.price,
    });
    
    try {
        const emailMessage = generateBorrowConfirmationEmail(
            user.name,
            book.title,
            new Date(),
            dueDate,
            10
        );
        
        await sendEmail({
            email: user.email,
            subject: "📚 Book Borrowed Confirmation - BookWorm Library",
            message: emailMessage,
        });
        
        console.log(`✅ Borrow confirmation email sent to ${user.email}`);
    } catch (emailError) {
        console.error("❌ Failed to send borrow confirmation email:", emailError.message);
    }
    
    res.status(200).json({
        success: true,
        message: "Borrowed book recorded successfully. Confirmation email sent.",
    });
});

export const returnBorrowedBook = catchAsyncErrors(async(req,res,next)=>{
    const {bookId} = req.params;
    let email;
    
    try {
        if(!req.body || typeof req.body !== 'object'){
            return next(new ErrorHndler("Please provide user email.", 400));
        }
        
        email = req.body.email;
        
        if(!email){
            return next(new ErrorHndler("Please provide user email.", 400));
        }
    } catch (error) {
        return next(new ErrorHndler("Please provide user email.", 400));
    }

    if(!mongoose.Types.ObjectId.isValid(bookId)){
        return next(new ErrorHndler("Invalid book ID format.", 400));
    }
    
    const book = await Book.findById(bookId);
    if(!book){
        return next(new ErrorHndler("Book not found.",404));
    }
    
    const user = await User.findOne({
        email: email,
        accountVerified: true
    });
    
    if(!user){
        return next(new ErrorHndler("User not found.",404));   
    }
    
    const borrowedBook = user.borrowedBooks.find(
        (b)=>b.bookId.toString()===bookId && b.returned === false
    );
    
    if(!borrowedBook){
        return next(new ErrorHndler("You have not borrowed this book.",400));
    }
    
    borrowedBook.returned = true;
    borrowedBook.returnedDate = new Date(); 
    await user.save();
    
    book.quantity += 1;
    book.availability = book.quantity > 0;
    await book.save(); 

    const borrow = await Borrow.findOne({
        book: bookId,
        "user.email": email,
        returnDate: null,  
    });
    
    if(!borrow){
        return next(new ErrorHndler("Borrow record not found.", 400));
    }
    
    borrow.returnDate = new Date();
    const fine = calculateFine(borrow.dueDate);
    borrow.fine = fine;
    await borrow.save();
    
    const dueDate = new Date(borrow.dueDate);
    const returnDate = new Date(borrow.returnDate);
    const daysLate = fine > 0 ? Math.ceil(fine / 10) : 0;
    
    try {
        const emailMessage = generateReturnConfirmationEmail(
            user.name,
            book.title,
            borrowedBook.borrowedDate,
            borrow.returnDate,
            borrow.dueDate,
            fine,
            daysLate
        );
        
        await sendEmail({
            email: user.email,
            subject: fine > 0 ? "⚠️ Book Returned with Late Fine" : "✅ Book Returned Successfully",
            message: emailMessage,
        });
        
        console.log(`✅ Return confirmation email sent to ${user.email}`);
    } catch (emailError) {
        console.error("❌ Failed to send return confirmation email:", emailError.message);
    }
    
    let message = "";
    if (fine !== 0) {
        message = `Book returned with late fine of ₹${fine}. Email sent.`;
    } else {
        message = `Book returned successfully on time. Email sent.`;
    }
    
    res.status(200).json({
        success: true,
        message: message,
        data: {
            bookTitle: book.title,
            borrowedDate: borrowedBook.borrowedDate,
            dueDate: borrow.dueDate,
            returnDate: borrow.returnDate,
            fine: fine,
            bookPrice: book.price,
            daysLate: daysLate
        }
    });
});

export const borrowedBooks = catchAsyncErrors(async(req,res,next)=>{
    const {borrowedBooks}=req.user;
    res.status(200).json({
        success: true,
        borrowedBooks,
    });
});

export const getBookBorrowedByAdmin = catchAsyncErrors(async(req,res,next)=>{
    const borrowedBooks = await Borrow.find().populate('book', 'title author subject');
    res.status(200).json({
        success: true,
        borrowedBooks,
    });
});