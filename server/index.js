import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDb from "./Configs/connectDb.js";
import authRoutes from "./Routes/auth.route.js";
import userRoutes from "./Routes/user.route.js";
import assistanRoutes from "./Routes/assistant.route.js"

import cookieParser from "cookie-parser";

// ১. Environment Variables লোড করা
dotenv.config();

const app = express();

const privateCors= cors({
    origin: "http://localhost:5173",
    credentials: true
})

const publicCors=cors({
    origin:"*"
})
// ২. Middlewares সেটআপ

app.use(express.json());
app.use(cookieParser()); // ⚠️ ব্র্যাকেট () দিতে ভুলবেন না

// ৩. Routes সেটআপ
app.get("/", (req, res) => {
    res.json("Hello from AI Voice Agent Server");
});

app.use("/api/auth",privateCors, authRoutes);
app.use("/api/user",privateCors, userRoutes);
app.use("/api/assistant",publicCors,assistanRoutes);



const PORT = process.env.PORT || 8000;

// ৪. সার্ভার এবং ডাটাবেস চালু করার ফাংশন (try-catch সহ)
const startServer = async () => {
    try {
        // প্রথমে ডাটাবেস কানেক্ট করুন
        await connectDb();
        console.log("✅ Database Connected Successfully");

        // তারপর সার্ভার চালু করুন
        const server = app.listen(PORT, () => {
            console.log(`🚀 Server Started On http://localhost:${PORT}`);
        });

        // যদি পোর্ট আগে থেকেই ব্যবহৃত হয়, তবে সেই এরর ধরার জন্য
        server.on('error', (error) => {
            if (error.code === 'EADDRINUSE') {
                console.error(`❌ Error: Port ${PORT} is already in use by another application.`);
                console.error(`👉 Please change the PORT in your .env file or close the other application.`);
            } else {
                console.error("❌ Server Error:", error);
            }
        });

    } catch (error) {
        console.error("❌ Failed to start the server:", error.message);
        process.exit(1); 
    }
};

// সার্ভার শুরু করুন
startServer();