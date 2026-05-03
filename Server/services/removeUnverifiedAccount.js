// services/removeUnverifiedAccount.js - Clean up unverified accounts

import cron from 'node-cron';
import { User } from '../models/userModel.js';

export const removeUnverifiedAccounts = () => {
    // Run every hour
    cron.schedule("0 * * * *", async () => {
        try {
            console.log("🧹 Running unverified accounts cleanup...");
            
            const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
            
            const result = await User.deleteMany({
                accountVerified: false,
                createdAt: { $lt: thirtyMinutesAgo },
            });
            
            if (result.deletedCount > 0) {
                console.log(`🗑️ Deleted ${result.deletedCount} unverified accounts`);
            } else {
                console.log("✅ No unverified accounts to clean up");
            }
        } catch (error) {
            console.error("❌ Error removing unverified accounts:", error);
        }
    });
    
    console.log("🧹 Cron job scheduled for unverified account cleanup (every hour)");
};