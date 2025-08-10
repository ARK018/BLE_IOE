import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import attendanceRoutes from "./routes/attendance.js";
import studentRoutes from "./routes/student.js";
import teacherRoutes from "./routes/teacher.js";
import fetch from "node-fetch";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/attendance", attendanceRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/teachers", teacherRoutes);

// Endpoint: POST /api/start-attendance
app.post("/api/start-attendance", async (req, res) => {
  // Forward the request to the ESP32 device
  const scanTime =
    req.body && req.body.scanTime ? parseInt(req.body.scanTime) : 5;
  try {
    const esp32Response = await fetch(
      "http://192.168.0.111/api/start-attendance",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scanTime }),
      }
    );
    const data = await esp32Response.json();
    res.status(esp32Response.status).json(data);
  } catch (error) {
    res
      .status(500)
      .json({
        status: "error",
        message: "Failed to contact ESP32",
        error: error.message,
      });
  }
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(process.env.PORT, () =>
      console.log(`Server running on port ${process.env.PORT}`)
    );
  })
  .catch((err) => console.error("MongoDB error:", err));
