import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    course: {
      type: String,
      required: true
    },
    income: {
      type: Number,
      required: true
    },
    category: {
      type: String,
      enum: ["General", "OBC", "SC", "ST"],
      required: true
    },
    profile_status: {
      type: String,
      enum: ["pending", "verified"],
      default: "pending"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Student", studentSchema);
