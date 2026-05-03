import { catchAsyncErrors } from "../Database/Middlewares/catchAsyncErrors.js";
import ErrorHndler from "../Database/Middlewares/errorMiddlewares.js";
import { User } from "../models/userModel.js";
import bcrypt from 'bcrypt'
import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs'

export const getAllUsers = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find({ accountVerified: true });
  res.status(200).json({
    success: true,
    users,
  });
});

export const registerNewAdmin = catchAsyncErrors(async (req, res, next) => {
  console.log("========== REGISTER NEW ADMIN ==========");
  console.log("req.body:", req.body);
  console.log("req.files:", req.files);
  
  const { name, email, mobile, password } = req.body || {};
  
  // ✅ Check if avatar is provided
  if (!req.files || Object.keys(req.files).length === 0) {
    console.log("❌ No avatar file received");
    return next(new ErrorHndler("Admin avatar is required. Please select an image.", 400));
  }
  
  // ✅ Check all fields
  if (!name || !email || !mobile || !password) {
    console.log("❌ Missing fields:", { name: !!name, email: !!email, mobile: !!mobile, password: !!password });
    return next(new ErrorHndler("Please fill all fields.", 400));
  }
  
  // ✅ Mobile validation
  const mobileRegex = /^[0-9]{10}$/;
  if (!mobileRegex.test(mobile)) {
    return next(new ErrorHndler("Please enter a valid 10-digit mobile number.", 400));
  }
  
  // ✅ Password validation
  if (password.length < 8 || password.length > 16) {
    return next(new ErrorHndler("Password must be between 8 to 16 characters.", 400));
  }
  
  // ✅ Check existing email
  const existingEmail = await User.findOne({ email, accountVerified: true });
  if (existingEmail) {
    return next(new ErrorHndler(`User with email ${email} already exists.`, 400));
  }
  
  // ✅ Check existing mobile
  const existingMobile = await User.findOne({ mobile, accountVerified: true });
  if (existingMobile) {
    return next(new ErrorHndler(`User with mobile number ${mobile} already exists.`, 400));
  }
  
  const { avatar } = req.files;
  const allowedFormats = ["image/png", "image/jpeg", "image/webp", "image/jpg"];
  
  if (!allowedFormats.includes(avatar.mimetype)) {
    return next(new ErrorHndler("File format not supported. Please upload PNG, JPEG, JPG, or WEBP.", 400));
  }
  
  if (avatar.size > 5 * 1024 * 1024) {
    return next(new ErrorHndler("File size too large. Max 5MB allowed.", 400));
  }
  
  const hashedPassword = await bcrypt.hash(password, 10);
  
  let cloudinaryResponse;
  try {
    console.log("📤 Uploading to Cloudinary...");
    cloudinaryResponse = await cloudinary.uploader.upload(avatar.tempFilePath, {
      folder: "LIBRARY_MANAGEMENT_SYSTEM_ADMIN_AVATARS",
      transformation: [
        { width: 500, height: 500, crop: "limit" },
        { quality: "auto" }
      ]
    });
    console.log("✅ Cloudinary upload success:", cloudinaryResponse.public_id);
  } catch (cloudinaryError) {
    console.error("❌ Cloudinary upload error:", cloudinaryError);
    return next(new ErrorHndler("Cloudinary upload failed. Please check your internet connection.", 500));
  }
  
  // ✅ Clean up temp file
  if (avatar.tempFilePath && fs.existsSync(avatar.tempFilePath)) {
    try {
      fs.unlinkSync(avatar.tempFilePath);
    } catch (err) {
      console.log("Temp file cleanup error:", err);
    }
  }
  
  // ✅ Create admin
  const admin = await User.create({
    name,
    email,
    mobile,
    password: hashedPassword,
    role: "Admin",
    accountVerified: true,
    avatar: {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    }
  });
  
  console.log("✅ Admin created successfully:", admin.email);
  
  res.status(201).json({
    success: true,
    message: "Admin registered successfully.",
    admin
  });
});