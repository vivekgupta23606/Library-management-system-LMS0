// services/borrowReminder.js - Send reminders for overdue books

import cron from 'node-cron';
import { Borrow } from '../models/borrowModal.js';
import { sendEmail } from '../Utils/sendEmail.js';
import { generateReturnConfirmationEmail } from '../Utils/emailTemplet.js';

export const sendOverdueReminders = () => {
    // Run every day at 10:00 AM
    cron.schedule("0 10 * * *", async () => {
        try {
            console.log("⏰ Running overdue reminder cron job...");
            
            const currentDate = new Date();
            
            // Find overdue books
            const overdueBorrows = await Borrow.find({
                dueDate: { $lt: currentDate },
                returnDate: null,
            }).populate('book', 'title');
            
            for (const borrow of overdueBorrows) {
                const dueDate = new Date(borrow.dueDate);
                const daysLate = Math.ceil((currentDate - dueDate) / (1000 * 60 * 60 * 24));
                
                if (borrow.user && borrow.user.email) {
                    const emailMessage = `
                        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                            <h2 style="color: #e63946;">⚠️ Overdue Book Alert</h2>
                            <p>Dear <strong>${borrow.user.name || borrow.user.email}</strong>,</p>
                            <p>The book "<strong>${borrow.book?.title || "Unknown Book"}</strong>" is <strong>${daysLate} days overdue</strong>.</p>
                            <p>Please return it immediately to avoid additional late fines.</p>
                            <p><strong>Current Late Fine:</strong> ₹${borrow.fine || daysLate * 10}</p>
                            <p>Fine increases by ₹10 per day.</p>
                            <div style="text-align: center; margin-top: 20px;">
                                <a href="${process.env.FRONTEND_URL}/my-borrowed-books" style="background-color: #4f46e5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                                    View My Books
                                </a>
                            </div>
                        </div>
                    `;
                    
                    await sendEmail({
                        email: borrow.user.email,
                        subject: "⚠️ Overdue Book Alert - BookWorm Library",
                        message: emailMessage,
                    });
                    
                    console.log(`✅ Overdue reminder sent to ${borrow.user.email} (${daysLate} days late)`);
                }
            }
            
            console.log(`📧 Sent ${overdueBorrows.length} overdue reminders`);
        } catch (error) {
            console.error("❌ Error sending overdue reminders:", error);
        }
    });
    
    console.log("📅 Overdue reminder cron job scheduled for 10:00 AM daily");
};