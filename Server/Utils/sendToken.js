// Utils/sendToken.js

export const sendToken = (user, statusCode, message, res) => {
  const token = user.generateToken();
  
  console.log("🔐 sendToken - Token generated for user:", user.email);
  console.log("🔐 Token:", token);
  
  // Cookie options
  const options = {
    expires: new Date(Date.now()+ 7 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    path: "/",
  };
  
  // Remove password from output
  const safeUser = {
    _id: user._id,
    name: user.name,
    email: user.email,
    mobile: user.mobile,
    role: user.role,
    accountVerified: user.accountVerified,
    avatar: user.avatar,
    borrowedBooks: user.borrowedBooks,
    createdAt: user.createdAt,
  };
  
  res.status(statusCode)
    .cookie("token", token, options)
    .json({
      success: true,
      user: safeUser,
      message,
      token,
    });
};