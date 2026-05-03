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
const PORT = process.env.PORT || 4000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`server is running on port ${PORT}`);
});