import express from "express";
import Student from "../models/Student.js";
import Attendance from "../models/Attendance.js";

const router = express.Router();

// Get all attendance records with student name and bluetoothId
router.get("/", async (req, res) => {
  try {
    const records = await Attendance.find().populate(
      "student",
      "name bluetoothId"
    );
    res.json(
      records.map((r) => ({
        _id: r._id,
        time: r.time,
        studentName: r.studentName, // Direct field from attendance record
        student: {
          _id: r.student._id,
          name: r.student.name,
          bluetoothId: r.student.bluetoothId,
        },
      }))
    );
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/", async (req, res) => {
  console.log("Received data at /api/attendance:", req.body);
  const { devices } = req.body;

  if (!Array.isArray(devices)) {
    return res.status(400).json({ message: "Invalid format" });
  }

  try {
    const matchedStudents = await Student.find({
      bluetoothId: { $in: devices },
    });

    const attendanceRecords = await Promise.all(
      matchedStudents.map((student) =>
        Attendance.create({
          student: student._id,
          studentName: student.name,
        })
      )
    );

    res.status(200).json({
      message: "Attendance marked",
      count: attendanceRecords.length,
      students: matchedStudents.map((s) => ({
        name: s.name,
        bluetoothId: s.bluetoothId,
      })),
    });
  } catch (error) {
    console.error("Error marking attendance:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
