import mongoose from "mongoose";

const scholarshipSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    provider: {
      type: String,
      required: true
    },
    eligibility_criteria: {
      type: String,
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    deadline: {
      type: Date,
      required: true
    },
    verification_status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending"
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Scholarship", scholarshipSchema);
