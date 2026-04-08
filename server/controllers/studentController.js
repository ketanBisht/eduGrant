import prisma from "../config/prisma.js";

/**
 * @desc    Get current student profile
 * @route   GET /api/students/profile
 * @access  Private
 */
export const getProfile = async (req, res) => {
    try {
        const student = await prisma.student.findUnique({
            where: { clerkId: req.auth.userId },
            include: { documents: true }
        });

        if (!student) {
            return res.status(404).json({ success: false, message: "Student not found" });
        }

        res.status(200).json({ success: true, data: student });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

/**
 * @desc    Update student profile (Profile Builder)
 * @route   PUT /api/students/profile
 * @access  Private
 */
export const updateProfile = async (req, res) => {
    try {
        const {
            name,
            course,
            income,
            category,
            state,
            gender,
            academicPercentage,
            whatsapp,
            fatherOccupation,
            motherOccupation,
            disability,
            religion,
            boardType,
            yearOfStudy,
        } = req.body;

        // Safe number parsing — never store NaN
        const safeIncome = income !== undefined && income !== '' ? parseFloat(income) : null;
        const safePercentage = academicPercentage !== undefined && academicPercentage !== '' ? parseFloat(academicPercentage) : null;

        // Build the data object — only include fields that were sent
        const data = {};

        // Original fields
        if (name !== undefined) data.name = name;
        if (gender !== undefined) data.gender = gender;
        if (whatsapp !== undefined) data.whatsapp = whatsapp;
        if (religion !== undefined) data.religion = religion;

        if (course !== undefined) data.course = course;
        if (yearOfStudy !== undefined) data.yearOfStudy = yearOfStudy;
        if (boardType !== undefined) data.boardType = boardType;
        if (academicPercentage !== undefined && academicPercentage !== '')
            data.academicPercentage = isNaN(safePercentage) ? null : safePercentage;

        if (state !== undefined) data.state = state;
        if (category !== undefined) data.category = category;
        if (disability !== undefined) data.disability = disability;

        if (income !== undefined && income !== '') data.income = isNaN(safeIncome) ? null : safeIncome;
        if (fatherOccupation !== undefined) data.fatherOccupation = fatherOccupation;
        if (motherOccupation !== undefined) data.motherOccupation = motherOccupation;

        // Check if all required fields are now complete
        // We fetch the current record first to merge with incoming data
        const current = await prisma.student.findUnique({
            where: { clerkId: req.auth.userId }
        });
        if (!current) {
            return res.status(404).json({ success: false, message: "Student not found" });
        }

        const merged = { ...current, ...data };
        const isComplete =
            (merged.name?.trim() || "") !== "" &&
            (merged.gender?.trim() || "") !== "" &&
            (merged.whatsapp?.trim() || "") !== "" &&
            (merged.course?.trim() || "") !== "" &&
            (merged.yearOfStudy?.trim() || "") !== "" &&
            (merged.state?.trim() || "") !== "" &&
            (merged.category?.trim() || "") !== "" &&
            merged.income !== null && merged.income !== undefined && !isNaN(merged.income) &&
            merged.academicPercentage !== null && merged.academicPercentage !== undefined && !isNaN(merged.academicPercentage) && merged.academicPercentage > 0;

        data.profileStatus = isComplete ? "COMPLETE" : "PENDING";

        const updatedStudent = await prisma.student.update({
            where: { clerkId: req.auth.userId },
            data
        });

        res.status(200).json({ success: true, data: updatedStudent });
    } catch (error) {
        console.error("updateProfile Error:", error);
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};
