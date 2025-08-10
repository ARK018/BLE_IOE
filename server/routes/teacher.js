import express from "express";
import Teacher from "../models/Teacher.js";

const router = express.Router();

// Create a new teacher
router.post("/", async (req, res) => {
  try {
    const { name, email, subject, bluetoothId } = req.body;
    const teacher = new Teacher({ name, email, subject, bluetoothId });
    await teacher.save();
    res.status(201).json(teacher);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all teachers
router.get("/", async (req, res) => {
  try {
    const teachers = await Teacher.find();
    res.json(teachers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a teacher by ID
router.get("/:id", async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) return res.status(404).json({ error: "Teacher not found" });
    res.json(teacher);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a teacher
router.put("/:id", async (req, res) => {
  try {
    const teacher = await Teacher.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!teacher) return res.status(404).json({ error: "Teacher not found" });
    res.json(teacher);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a teacher
router.delete("/:id", async (req, res) => {
  try {
    const teacher = await Teacher.findByIdAndDelete(req.params.id);
    if (!teacher) return res.status(404).json({ error: "Teacher not found" });
    res.json({ message: "Teacher deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
