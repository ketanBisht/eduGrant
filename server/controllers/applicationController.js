import Application from "../models/Application.js";
import Scholarship from "../models/Scholarship.js";

// @desc    Apply to a scholarship
// @route   POST /api/applications
// @access  Private (Student)
export const applyToScholarship = async (req, res) => {
  try {
    const { scholarshipId } = req.body;
    const studentId = req.user._id;

    if (!scholarshipId) {
      return res.status(400).json({ success: false, message: "Scholarship ID is required" });
    }

    // Check if scholarship exists
    const scholarship = await Scholarship.findById(scholarshipId);
    if (!scholarship) {
      return res.status(404).json({ success: false, message: "Scholarship not found" });
    }

    // Prevent duplicate entries
    const existingApplication = await Application.findOne({ student: studentId, scholarship: scholarshipId });
    if (existingApplication) {
      return res.status(400).json({ success: false, message: "You have already applied for this scholarship" });
    }

    // Create Application
    const application = await Application.create({
      student: studentId,
      scholarship: scholarshipId,
      application_status: "pending"
    });

    res.status(201).json({ success: true, data: application });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: "Duplicate application detected" });
    }
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// @desc    Get logged-in user applications
// @route   GET /api/applications/user
// @access  Private (Student)
export const getUserApplications = async (req, res) => {
  try {
    const applications = await Application.find({ student: req.user._id })
      .populate("scholarship")
      .sort({ applied_date: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// @desc    Get all applications
// @route   GET /api/applications/admin
// @access  Private (Admin)
export const getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate("scholarship")
      .populate("student", "name email course category")
      .sort({ applied_date: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};
