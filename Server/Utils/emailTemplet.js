
export function genVerificationOtpTemp(otpCode) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Email Verification</title>
      <style>
        body { margin: 0; padding: 0; background-color: #f4f6f8; font-family: Arial, sans-serif; }
        .email-container { max-width: 600px; margin: 30px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
        .email-header { background-color: #4f46e5; color: #ffffff; text-align: center; padding: 20px; font-size: 22px; font-weight: bold; }
        .email-body { padding: 25px; color: #333333; font-size: 15px; line-height: 1.6; text-align: center; }
        .otp-box { display: inline-block; margin: 20px 0; padding: 15px 30px; font-size: 28px; font-weight: bold; letter-spacing: 6px; background-color: #f0f2ff; color: #4f46e5; border-radius: 6px; }
        .note { font-size: 14px; color: #666666; margin-top: 10px; }
        .email-footer { background-color: #f9fafb; padding: 15px; text-align: center; font-size: 12px; color: #777777; }
        @media only screen and (max-width: 600px) {
          .email-container { margin: 10px; }
          .otp-box { font-size: 22px; letter-spacing: 3px; padding: 10px 20px; }
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="email-header">Verify Your Email</div>
        <div class="email-body">
          <p>Hello User,</p>
          <p>Thank you for registering. Please use the following OTP to verify your email address.</p>
          <div class="otp-box">${otpCode}</div>
          <p class="note">This OTP is valid for 15 minutes. Please do not share this code with anyone.</p>
          <p>If you did not request this verification, please ignore this email.</p>
        </div>
        <div class="email-footer">© 2026 Bookworm team</div>
      </div>
    </body>
    </html>
  `;
}

//Reset Password Email Template
export function generateResetPassEmailTemp(resetLink) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reset Password</title>
      <style>
        @media only screen and (max-width: 600px) {
          .container { width: 100% !important; padding: 10px !important; }
          .button { padding: 14px 25px !important; font-size: 16px !important; display: block !important; text-align: center !important; }
          .link-text { word-break: break-all !important; font-size: 12px !important; }
        }
        body { margin: 0; padding: 20px; font-family: Arial, sans-serif; background-color: #f4f6f8; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; }
        .header { padding: 20px; text-align: center; background: #000; color: white; }
        .content { padding: 30px 20px; }
        .button { background-color: #007BFF; color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold; }
        .link-text { font-size: 12px; color: #666; word-break: break-all; margin-top: 20px; background: #f5f5f5; padding: 10px; border-radius: 5px; }
        hr { margin: 20px 0; }
        .footer { text-align: center; font-size: 12px; color: #666; padding: 15px; background: #f9f9f9; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>BookWorm Library</h2>
        </div>
        <div class="content">
          <p>Hello,</p>
          <p>You requested to reset your password. Click the button below:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" class="button">Reset Password</a>
          </div>
          <p>If button doesn't work, copy and paste this link in your browser:</p>
          <p class="link-text">${resetLink}</p>
          <p>This link expires in <strong>15 minutes</strong>.</p>
          <hr>
          <p style="font-size: 12px; color: #999;">If you didn't request this, please ignore this email.</p>
        </div>
        <div class="footer">
          <p>BookWorm Library Team</p>
        </div>
      </div>
    </body>
    </html>
  `;
}



export const generateBorrowConfirmationEmail = (userName, bookTitle, borrowDate, dueDate, finePerDay = 10) => {
  const formattedBorrowDate = new Date(borrowDate).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  
  const formattedDueDate = new Date(dueDate).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Book Borrowed Confirmation</title>
      <style>
        body { margin: 0; padding: 20px; font-family: Arial, sans-serif; background-color: #f4f6f8; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { background: #4f46e5; color: white; padding: 20px; text-align: center; }
        .content { padding: 30px; }
        .book-details { background: #f0f2ff; padding: 15px; border-radius: 8px; margin: 15px 0; }
        .due-date { color: #e63946; font-weight: bold; }
        .fine-info { background: #fff3cd; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #ffc107; }
        .footer { text-align: center; padding: 15px; font-size: 12px; color: #666; background: #f9fafb; }
        @media only screen and (max-width: 600px) {
          .content { padding: 15px; }
          h2 { font-size: 18px; }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>📚 Book Borrowed Confirmation</h2>
        </div>
        <div class="content">
          <p>Dear <strong>${userName}</strong>,</p>
          
          <p>You have successfully borrowed a book from the BookWorm Library. Here are the details:</p>
          
          <div class="book-details">
            <p><strong>📖 Book Title:</strong> ${bookTitle}</p>
            <p><strong>📅 Borrowed Date:</strong> ${formattedBorrowDate}</p>
            <p><strong>⏰ Due Date:</strong> <span class="due-date">${formattedDueDate}</span></p>
          </div>
          
          <div class="fine-info">
            <p><strong>⚠️ Important Return Policy:</strong></p>
            <p>Please return the book on or before the due date to avoid late fines.</p>
            <p><strong>💰 Late Fine:</strong> ₹${finePerDay} per day after the due date.</p>
            <p>Grace period: <strong>7 days</strong> (No fine for first 7 days after due date)</p>
          </div>
          
          <p>Thank you for choosing BookWorm Library. Happy Reading! 📚</p>
          
          <!-- ❌ VIEW MY BORROWED BOOKS BUTTON REMOVED -->
        </div>
        <div class="footer">
          <p>© 2026 BookWorm Library Management System</p>
          <p>This is an automated message, please do not reply.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

//Return Confirmation Email Template


export const generateReturnConfirmationEmail = (userName, bookTitle, borrowDate, returnDate, dueDate, fine, daysLate) => {
  const formattedBorrowDate = new Date(borrowDate).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  
  const formattedReturnDate = new Date(returnDate).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  
  const formattedDueDate = new Date(dueDate).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
  
  const isLate = fine > 0;
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Book Return Confirmation</title>
      <style>
        body { margin: 0; padding: 20px; font-family: Arial, sans-serif; background-color: #f4f6f8; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { background: ${isLate ? '#e63946' : '#2ecc71'}; color: white; padding: 20px; text-align: center; }
        .content { padding: 30px; }
        .book-details { background: #f0f2ff; padding: 15px; border-radius: 8px; margin: 15px 0; }
        .fine-box { background: ${isLate ? '#fff3cd' : '#d4edda'}; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid ${isLate ? '#ffc107' : '#28a745'}; }
        .fine-amount { font-size: 28px; font-weight: bold; color: ${isLate ? '#e63946' : '#2ecc71'}; }
        .footer { text-align: center; padding: 15px; font-size: 12px; color: #666; background: #f9fafb; }
        @media only screen and (max-width: 600px) {
          .content { padding: 15px; }
          .fine-amount { font-size: 22px; }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>${isLate ? '⚠️ Book Returned with Late Fine' : '✅ Book Returned Successfully'}</h2>
        </div>
        <div class="content">
          <p>Dear <strong>${userName}</strong>,</p>
          
          <p>You have successfully returned a book to the BookWorm Library. Here are the details:</p>
          
          <div class="book-details">
            <p><strong>📖 Book Title:</strong> ${bookTitle}</p>
            <p><strong>📅 Borrowed Date:</strong> ${formattedBorrowDate}</p>
            <p><strong>📅 Return Date:</strong> ${formattedReturnDate}</p>
            <p><strong>⏰ Due Date:</strong> ${formattedDueDate}</p>
          </div>
          
          <div class="fine-box">
            <p><strong>💰 Fine Summary:</strong></p>
            ${isLate ? `
              <p>❌ The book was returned <strong>${daysLate} days late</strong>.</p>
              <p>📅 Days overdue: <strong>${daysLate} days</strong></p>
              <p>💵 Fine per day: <strong>₹10</strong></p>
              <p class="fine-amount">Total Late Fine: ₹${fine}</p>
              <p style="margin-top: 10px; font-size: 14px; color: #666;">Please clear the fine at the library counter.</p>
            ` : `
              <p>✅ The book was returned <strong>ON TIME</strong>!</p>
              <p>📅 No overdue days.</p>
              <p class="fine-amount">Total Fine: ₹0</p>
              <p style="margin-top: 10px; font-size: 14px; color: #666;">Thank you for returning the book on time!</p>
            `}
          </div>
          
          <p>Thank you for using BookWorm Library!</p>
          
          <!-- ❌ VIEW MY BORROWED BOOKS BUTTON REMOVED -->
        </div>
        <div class="footer">
          <p>© 2026 BookWorm Library Management System</p>
          <p>This is an automated message, please do not reply.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

//Due Date Reminder Email Template
export const generateDueReminderEmail = (userName, bookTitle, dueDate, daysLeft) => {
  const formattedDueDate = new Date(dueDate).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Book Due Reminder</title>
      <style>
        body { margin: 0; padding: 20px; font-family: Arial, sans-serif; background-color: #f4f6f8; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; }
        .header { background: #e63946; color: white; padding: 20px; text-align: center; }
        .content { padding: 30px; }
        .days-left { color: #e63946; font-weight: bold; font-size: 24px; }
        .btn { display: inline-block; background: #4f46e5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 15px; }
        .footer { text-align: center; padding: 15px; font-size: 12px; color: #666; background: #f9fafb; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>⏰ Book Due Date Reminder</h2>
        </div>
        <div class="content">
          <p>Dear <strong>${userName}</strong>,</p>
          <p>This is a reminder that the book "<strong>${bookTitle}</strong>" is due on <strong>${formattedDueDate}</strong>.</p>
          <p class="days-left">${daysLeft} days remaining</p>
          <p>Please return the book on time to avoid late fines of <strong>₹10 per day</strong> after the due date.</p>
          <div style="text-align: center;">
            <a href="${process.env.FRONTEND_URL}/my-borrowed-books" class="btn">View My Borrowed Books</a>
          </div>
          <p>Thank you for using BookWorm Library!</p>
        </div>
        <div class="footer">
          <p>© 2026 BookWorm Library Management System</p>
          <p>This is an automated message, please do not reply.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};