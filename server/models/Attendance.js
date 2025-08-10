import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  studentName: {
    type: String,
    required: true,
  },
  time: { type: Date, default: Date.now },
});

export default mongoose.model("Attendance", attendanceSchema);
