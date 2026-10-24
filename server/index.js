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
app.use(cookieParser()); 

// ৩. Routes সেটআপ
app.get("/", (req, res) => {
    res.json("Hello from AI Voice Agent Server");
});

app.use("/api/auth",privateCors, authRoutes);
app.use("/api/user",privateCors, userRoutes);
app.use("/api/assistant",publicCors,assistanRoutes);

// ডাটাবেস কানেকশন ফাংশন
const startServer = async () => {
    try {
        await connectDb();
        console.log("✅ Database Connected Successfully");
    } catch (error) {
        console.error("❌ Failed to connect to the database:", error.message);
        process.exit(1); 
    }
};

startServer();

// Vercel-এর জন্য app এক্সপোর্ট করুন
export default app;

// লোকাল ডেভেলপমেন্টের জন্য (শুধু তখনই চালু হবে যখন সরাসরি node index.js চালানো হবে)
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 8000;
    app.listen(PORT, () => {
        console.log(`🚀 Server Started On http://localhost:${PORT}`);
    });
}