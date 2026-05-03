import { catchAsyncErrors } from "../Database/Middlewares/catchAsyncErrors.js";
import ErrorHndler from "../Database/Middlewares/errorMiddlewares.js";
import { User } from "../models/userModel.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { sendVerificationCode } from "../Utils/sendVerificationCode.js";
import { sendToken } from "../Utils/sendToken.js";
import { sendEmail } from "../Utils/sendEmail.js";
import { generateResetPassEmailTemp } from "../Utils/emailTemplet.js";

export const register = catchAsyncErrors(async (req, res, next) => {
  try {
    const { name, email, password, mobile } = req.body;
    
    console.log("========== REGISTER ATTEMPT ==========");
    console.log("Name:", name);
    console.log("Email:", email);
    console.log("Mobile:", mobile);
    
    if (!name || !email || !password || !mobile) {
      return next(new ErrorHndler("Please enter all fields including mobile number.", 400));
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return next(new ErrorHndler("Please enter a valid email address", 400));
    }
    
    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test(mobile)) {
      return next(new ErrorHndler("Please enter a valid 10-digit mobile number", 400));
    }
    
    if (password.length < 6) {
      return next(new ErrorHndler("Password must be at least 6 characters", 400));
    }
    
    const existingUser = await User.findOne({ email: email.toLowerCase(), accountVerified: true });
    if (existingUser) {
      return next(new ErrorHndler("User already exists with this email. Please login.", 400));
    }
    
    const existingMobile = await User.findOne({ mobile, accountVerified: true });
    if (existingMobile) {
      return next(new ErrorHndler("Mobile number already registered. Please login.", 400));
    }
    
    await User.deleteMany({ email: email.toLowerCase(), accountVerified: false });
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase(),
      mobile: mobile,
      password: hashedPassword,
    });
    
    const verificationCode = await user.generateVerificationCode();
    await user.save();
    
    console.log("OTP Generated:", verificationCode);
    
    sendVerificationCode(verificationCode, email).catch(err => {
      console.error("Email sending failed:", err);
    });
    
    res.status(200).json({
      success: true,
      message: `Registration successful! Verification code sent to ${email}. Please verify your email.`,
    });
    
  } catch (error) {
    console.error("Registration error:", error);
    return next(new ErrorHndler(error.message || "Registration failed", 500));
  }
});

export const verifyOTP = catchAsyncErrors(async (req, res, next) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return next(new ErrorHndler("Email or OTP is missing", 400));
  }
  try {
    const userAllEntries = await User.find({
      email,
      accountVerified: false,
    }).sort({ createdAt: -1 });
    
    if (!userAllEntries || userAllEntries.length === 0) {
      return next(new ErrorHndler("User not found.", 400));
    }
    let user;
    if (userAllEntries.length > 1) {
      user = userAllEntries[0];
      await User.deleteMany({
        _id: { $ne: user._id },
        email,
        accountVerified: false,
      });
    } else {
      user = userAllEntries[0];
    }
    
    if (user.verificationCode !== parseInt(otp)) {
      return next(new ErrorHndler("Invalid OTP.", 400));
    }
    const currentTime = Date.now();
    const verificationCodeExpire = new Date(user.verificationCodeExpire).getTime();
    if (currentTime > verificationCodeExpire) {
      return next(new ErrorHndler("OTP expired.", 400));
    }
    user.accountVerified = true;
    user.verificationCode = null;
    user.verificationCodeExpire = null;
    await user.save({ validateModifiedOnly: true });
    sendToken(user, 200, "Account Verified.", res);
  } catch (error) {
    return next(new ErrorHndler("Internal Server Error", 500));
  }
});

export const login = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;
  
  console.log("Login attempt - Email:", email);
  
  if (!email || !password) {
    return next(new ErrorHndler("Please enter email and password", 400));
  }
  
  const user = await User.findOne({ email, accountVerified: true }).select("+password");
  
  if (!user) {
    console.log(" User not found:", email);
    return next(new ErrorHndler("Invalid email or password. User not found.", 401));
  }
  
  const isPasswordMatched = await bcrypt.compare(password, user.password);
  if (!isPasswordMatched) {
    console.log(" Password mismatch for:", email);
    return next(new ErrorHndler("Invalid email or password. Please try again.", 401));
  }
  
  console.log(" Login successful for:", email);
  
  sendToken(user, 200, "User login successfully", res);
});

export const logout = catchAsyncErrors(async (req, res, next) => {
  res
    .status(200)
    .cookie("token", "", {
      expires: new Date(Date.now()),
      httpOnly: true,
    })
    .json({
      success: true,
      message: "Logged out successfully.",
    });
});

export const getUser = catchAsyncErrors(async (req, res, next) => {
  if (!req.user) {
    return next(new ErrorHndler("User not authenticated", 401));
  }
  
  const user = await User.findById(req.user._id).select("-password");
  
  if (!user) {
    return next(new ErrorHndler("User not found", 404));
  }
  
  res.status(200).json({
    success: true,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      role: user.role,
      accountVerified: user.accountVerified,
      avatar: user.avatar,
      borrowedBooks: user.borrowedBooks,
      createdAt: user.createdAt,
    },
  });
});

export const forgetPassword = catchAsyncErrors(async (req, res, next) => {
  console.log("========== FORGET PASSWORD ==========");
  console.log("Headers:", req.headers);
  console.log("Body:", req.body);
  console.log("Email from body:", req.body?.email);
  if (!req.body.email) {
    return next(new ErrorHndler("Email is required", 400));
  }
  
  const user = await User.findOne({
    email: req.body.email,
    accountVerified: true,
  });
  
  if (!user) {
    return next(new ErrorHndler("Invalid email.", 400));
  }
  
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });
  
  const resetPasswordUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;
  const message = generateResetPassEmailTemp(resetPasswordUrl);
  
  try {
    await sendEmail({
      email: user.email,
      subject: "Bookworm Library - Password Reset Request",
      message,
    });
    res.status(200).json({
      success: true,
      message: `Password reset link sent to ${user.email}. Please check your inbox.`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorHndler(error.message, 500));
  }
});

export const resetpassword = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.params;

  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHndler(
        "Reset password token is invalid or has been expired.",
        400,
      ),
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(
      new ErrorHndler("Password & confirm password do not match.", 400),
    );
  }

  if (req.body.password.length < 8 || req.body.password.length > 16) {
    return next(
      new ErrorHndler("Password must be between 8 to 16 Characters", 400),
    );
  }

  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  user.password = hashedPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  //  Send response WITHOUT auto-login (send only message)
  res.status(200).json({
    success: true,
    message: "Password reset successfully. Please login with your new password.",
  });
});
export const updatepassword = catchAsyncErrors(async (req, res, next) => {
  console.log("========== UPDATE PASSWORD ==========");
  console.log("User from token:", req.user?._id);
  
  if (!req.user) {
    console.log(" No user found in request");
    return next(new ErrorHndler("Please login to access this resource", 401));
  }
  
  const user = await User.findById(req.user._id).select("+password");
  const { currentPassword, newPassword, confirmNewPassword } = req.body;
  
  console.log("Fields received:", { 
    currentPassword: currentPassword ? "Yes" : "No",
    newPassword: newPassword ? "Yes" : "No",
    confirmNewPassword: confirmNewPassword ? "Yes" : "No"
  });
  
  if (!currentPassword || !newPassword || !confirmNewPassword) {
    return next(new ErrorHndler("Please enter all fields", 400));
  }
  
  const isPasswordMatched = await bcrypt.compare(currentPassword, user.password);
  if (!isPasswordMatched) {
    return next(new ErrorHndler("Current password is incorrect", 400));
  }
  
  if (newPassword.length < 8 || newPassword.length > 16) {
    return next(new ErrorHndler("Password must be between 8 to 16 Characters", 400));
  }
  
  if (newPassword !== confirmNewPassword) {
    return next(new ErrorHndler("New password and confirm new password do not match.", 400));
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  await user.save();
  
  console.log(" Password updated successfully for user:", user.email);
  
  //  Generate new token and send in response
  const token = user.generateToken();
  
  res.status(200).json({
    success: true,
    message: "Password updated successfully.",
    token: token
  });
});