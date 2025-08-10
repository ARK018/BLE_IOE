import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  bluetoothId: { type: String, required: true }, // e.g., 3C:B0:ED:44:39:14
  password: { type: String, required: true },
});

export default mongoose.model("Student", studentSchema);
