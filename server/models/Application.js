import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true
    },
    scholarship: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Scholarship",
      required: true
    },
    application_status: {
      type: String,
      enum: ["applied", "approved", "rejected"],
      default: "applied"
    },
    applied_date: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

// Prevent duplicate applications
applicationSchema.index(
  { student: 1, scholarship: 1 },
  { unique: true }
);

export default mongoose.model("Application", applicationSchema);
