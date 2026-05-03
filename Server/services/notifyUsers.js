// services/notifyUsers.js - Cron job for due date reminders

import cron from 'node-cron';
import { Borrow } from '../models/borrowModal.js';
import { sendEmail } from '../Utils/sendEmail.js';
import { generateDueReminderEmail } from '../Utils/emailTemplet.js';

export const notifyUsers = () => {
    // Run every day at 9:00 AM
    cron.schedule("0 9 * * *", async () => {
        try {
            console.log("⏰ Running due date reminder cron job...");
            
            const currentDate = new Date();
            const threeDaysFromNow = new Date();
            threeDaysFromNow.setDate(currentDate.getDate() + 3);
            
            // Find books due in next 3 days
            const borrowers = await Borrow.find({
                dueDate: { $gte: currentDate, $lte: threeDaysFromNow },
                returnDate: null,
                notified: false,
            }).populate('book', 'title');
            
            for (const borrow of borrowers) {
                const dueDate = new Date(borrow.dueDate);
                const daysLeft = Math.ceil((dueDate - currentDate) / (1000 * 60 * 60 * 24));
                
                if (borrow.user && borrow.user.email) {
                    const emailMessage = generateDueReminderEmail(
                        borrow.user.name || borrow.user.email,
                        borrow.book?.title || "Unknown Book",
                        borrow.dueDate,
                        daysLeft
                    );
                    
                    await sendEmail({
                        email: borrow.user.email,
                        subject: "⏰ Book Due Date Reminder - BookWorm Library",
                        message: emailMessage,
                    });
                    
                    borrow.notified = true;
                    await borrow.save();
                    console.log(`✅ Reminder email sent to ${borrow.user.email}`);
                }
            }
            
            console.log(`📧 Sent ${borrowers.length} reminder emails`);
        } catch (error) {
            console.error("❌ Error notifying users:", error);
        }
    });
    
    console.log("📅 Cron job scheduled for daily reminders at 9:00 AM");
};