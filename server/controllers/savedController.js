import prisma from "../config/prisma.js";

// @desc    Save a scholarship
// @route   POST /api/saved
// @access  Private
export const saveScholarship = async (req, res) => {
    try {
        const student = req.user;
        const { scholarshipId } = req.body;

        if (!student) {
            return res.status(401).json({ success: false, message: "Student profile not found" });
        }

        const newSaved = await prisma.savedScholarship.create({
            data: {
                studentId: student.id,
                scholarshipId
            }
        });

        res.status(201).json({ success: true, data: newSaved });
    } catch (error) {
        if (error.code === 'P2002') {
            return res.status(400).json({ success: false, message: "Scholarship already saved" });
        }
        console.error("Save Scholarship Error:", error);
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

// @desc    Unsave a scholarship
// @route   DELETE /api/saved/:scholarshipId
// @access  Private
export const unsaveScholarship = async (req, res) => {
    try {
        const student = req.user;
        const { scholarshipId } = req.params;

        if (!student) {
            return res.status(401).json({ success: false, message: "Student profile not found" });
        }

        await prisma.savedScholarship.delete({
            where: {
                studentId_scholarshipId: {
                    studentId: student.id,
                    scholarshipId
                }
            }
        });

        res.status(200).json({ success: true, message: "Scholarship unsaved" });
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ success: false, message: "Saved scholarship not found" });
        }
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

// @desc    Get all saved scholarships for the student
// @route   GET /api/saved
// @access  Private
export const getSavedScholarships = async (req, res) => {
    try {
        const student = req.user;

        if (!student) {
            return res.status(401).json({ success: false, message: "Student profile not found" });
        }

        const saved = await prisma.savedScholarship.findMany({
            where: { studentId: student.id },
            include: {
                scholarship: true
            },
            orderBy: { savedAt: 'desc' }
        });

        const formatted = saved.map(s => {
            const sch = s.scholarship;
            // Calculate days left
            let urgencyStr = null;
            let isUrgent = false;
            let isExpired = false;
            if (sch.deadline) {
                const daysLeft = Math.ceil((new Date(sch.deadline) - new Date()) / (1000 * 60 * 60 * 24));
                if (daysLeft < 0) {
                    urgencyStr = "Expired";
                    isExpired = true;
                } else if (daysLeft <= 7) {
                    urgencyStr = `${daysLeft} day(s) left!`;
                    isUrgent = true;
                } else {
                    urgencyStr = `${daysLeft} days left`;
                }
            }

            return {
                ...sch,
                savedAt: s.savedAt,
                urgencyStr,
                isUrgent,
                isExpired
            };
        });

        res.status(200).json({ success: true, count: formatted.length, data: formatted });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};
