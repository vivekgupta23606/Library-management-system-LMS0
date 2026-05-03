// server.js - Main server file

import app from "./App.js";
import { v2 as cloudinary } from 'cloudinary';

// Cloudinary Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLIENT_NAME,
    api_key: process.env.CLOUDINARY_CLIENT_API,
    api_secret: process.env.CLOUDINARY_CLIENT_SECRET,
});

// Verify Cloudinary config
console.log("☁️ Cloudinary configured with:");
console.log(`   - cloud_name: ${process.env.CLOUDINARY_CLIENT_NAME ? "Set" : "❌ Missing"}`);
console.log(`   - api_key: ${process.env.CLOUDINARY_CLIENT_API ? "Set" : "❌ Missing"}`);
console.log(`   - api_secret: ${process.env.CLOUDINARY_CLIENT_SECRET ? "Set" : "❌ Missing"}`);

// Start Server on all network interfaces
app.listen(process.env.PORT, '0.0.0.0', () => {
    console.log(`🚀 server is running on port ${process.env.PORT}`);
    console.log(`📱 Local access: http://localhost:${process.env.PORT}`);
    console.log(`🌐 Network access: http://10.168.229.80:${process.env.PORT}`);
});