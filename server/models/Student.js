import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    clerkId: {
      type: String,
      required: true,
      unique: true
    },
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
    role: {
      type: String,
      enum: ["student", "admin"],
      default: "student"
    },
    course: {
      type: String
    },
    income: {
      type: Number
    },
    category: {
      type: String,
      enum: ["General", "OBC", "SC", "ST"]
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
