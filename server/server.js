import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import recruiterDashboardRoutes from "./routes/recruiterDashboardRoutes.js";
import bookmarkRoutes from "./routes/bookmarkRoutes.js";
import companyRoutes from "./routes/companyRoutes.js";
import applicationStatusRoutes from "./routes/applicationStatusRoutes.js";

dotenv.config();

const app = express();

// Database Connection
await connectDB();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/company", companyRoutes);
app.use("/uploads", express.static("uploads"));

app.use("/api/applications", applicationStatusRoutes);

app.use("/api/dashboard", dashboardRoutes);
app.use("/api/dashboard", recruiterDashboardRoutes);
app.use("/api/recruiter-dashboard", recruiterDashboardRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/users", userRoutes);
app.use("/api/bookmarks", bookmarkRoutes);


// Health Check Route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "🚀 AI Powered Applicant Tracking System Backend is Running Successfully",
  });
});

// Default Route
app.get("/api", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to AI Powered ATS API",
  });
});

// Handle Invalid Routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found",
  });
});

// Server Port
const PORT = process.env.PORT || 5000;

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
