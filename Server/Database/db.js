import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            dbName: "mern_stack_library_management_system"
        });
        console.log("✅ Database connected successfully");
    } catch (err) {
        console.log("❌ Error connecting to Database:", err);
        process.exit(1);
    }
};