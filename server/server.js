import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/db.js";

import adminRouter from "./routes/adminRoute.js";
import blogRouter from "./routes/blogRoute.js";
import commentRouter from "./routes/commentRoute.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
connectDB();

// Test Route
app.get("/", (req, res) => {
  res.send("API Working");
});

// Routes
app.use("/api/admin", adminRouter);
app.use("/api/blog", blogRouter);
app.use("/api/comment", commentRouter);

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});