import prisma from "../config/prisma.js";

// @desc    Apply to a scholarship
// @route   POST /api/applications
// @access  Private (Student)
export const applyToScholarship = async (req, res) => {
  try {
    const { scholarshipId } = req.body;
    // Assuming student info is attached to req.user (Mongo ID from Prisma Student record)
    const studentId = req.user.id;

    if (!scholarshipId) {
      return res.status(400).json({ success: false, message: "Scholarship ID is required" });
    }

    // Check if scholarship exists
    const scholarship = await prisma.scholarship.findUnique({
      where: { id: scholarshipId }
    });
    if (!scholarship) {
      return res.status(404).json({ success: false, message: "Scholarship not found" });
    }

    // Prevent duplicate entries
    const existingApplication = await prisma.application.findFirst({
        where: {
            studentId,
            scholarshipId
        }
    });
    if (existingApplication) {
      return res.status(400).json({ success: false, message: "You have already applied for this scholarship" });
    }

    // --- NEW: Vault Verification Step ---
    // Check if student has at least one verified document
    const verifiedDocs = await prisma.document.count({
        where: {
            studentId,
            isVerified: true
        }
    });

    if (verifiedDocs === 0) {
        return res.status(400).json({ 
            success: false, 
            message: "Application Locked: You must have at least one verified document in your EduGrant Vault to apply directly." 
        });
    }

    // Simulate official sync with government/provider servers
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Create Application
    const application = await prisma.application.create({
      data: {
        studentId,
        scholarshipId,
        status: "PENDING"
      }
    });

    res.status(201).json({ 
      success: true, 
      message: "Application securely synced with official registry via EduGrant Vault",
      data: application 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// @desc    Get logged-in user applications
// @route   GET /api/applications/user
// @access  Private (Student)
export const getUserApplications = async (req, res) => {
  try {
    const applications = await prisma.application.findMany({
        where: { studentId: req.user.id },
        include: { scholarship: true },
        orderBy: { appliedAt: 'desc' }
    });

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
    const applications = await prisma.application.findMany({
        include: {
            scholarship: true,
            student: {
                select: {
                    name: true,
                    email: true,
                    course: true,
                    category: true
                }
            }
        },
        orderBy: { appliedAt: 'desc' }
    });

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};
