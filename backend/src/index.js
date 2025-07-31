import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/auth.route.js";     // Since it is a local file we need to put extension at the end because type:"module"
import messageRoutes from "./routes/message.route.js";
import { connectDB } from "./lib/db.js";
import { app, server } from "./lib/socket.js";

dotenv.config();

const PORT = process.env.PORT;

app.use(express.json());
app.use(cookieParser()); // Allow you to parse the cookie
app.use(cors({
    origin : "http://localhost:5173",
    credentials : true, // allows cookies and authorisation headers to be sent with the requests
}))

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);


// We use server.listen() to start the HTTP server and bind it to a port, so it can begin accepting incoming connections (like HTTP requests or WebSocket connections).
server.listen(PORT, async ()=>{
    console.log(`Server is running ${PORT}`);
    await connectDB();
})


