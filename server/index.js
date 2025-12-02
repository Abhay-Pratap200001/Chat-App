import express from 'express'
import dotenv from "dotenv";
import path from 'path'
import cors from 'cors'


import cookieParser from 'cookie-parser';
import authRoute from './routes/auth.Route.js'
import messageRoutes from "./routes/message.Routes.js";
import { errorHandler } from './middleware/error.Middleware.js';


import { connectDB } from './lib/dbConnection.js';
import { app, server } from './lib/socket.js';


dotenv.config({ path: "../.env" });
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve()



// Middlewares
app.use(cors({
  origin: process.env.NODE_ENV === "production" ? true : "http://localhost:5173",
  credentials: true
}));


app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use(cookieParser());

// Routes
app.use("/api/auth", authRoute)
app.use("/api/messages", messageRoutes)

if (process.env.NODE_ENV === "production") {
  const clientPath = path.join(__dirname, "client", "dist");

  app.use(express.static(clientPath));

  app.get("*", (_, res) => {
    res.sendFile(path.join(clientPath, "index.html"));
  });
}

// Error Handler
app.use(errorHandler);


// Home Route
app.get("/", (_, res) => {
    res.send("working");
});


// DB Connection + Start Server
connectDB()
  .then(() => {
    const serverr = server.listen(PORT, () => {
      console.log(`✅ Server running at http://localhost:${PORT}`);
    });

    serverr.on("error", (error) => {
      console.error("❌ Server Error:", error);
      process.exit(1);
    });
  })
  .catch((error) => {
    console.error("❌ MongoDB Connection Failed:", error);
    process.exit(1);
  });
