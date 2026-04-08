import prisma from "../config/prisma.js";

/**
 * @desc    Get Global Platform Statistics
 * @route   GET /api/admin/stats
 * @access  Private (Admin Only)
 */
export const getStats = async (req, res) => {
    try {
        const [userCount, scholarshipCount, applicationCount, totalBenefit] = await Promise.all([
            prisma.student.count(),
            prisma.scholarship.count(),
            prisma.application.count(),
            prisma.scholarship.aggregate({
                _sum: { amount: true }
            })
        ]);

        res.status(200).json({
            success: true,
            data: {
                users: userCount,
                scholarships: scholarshipCount,
                applications: applicationCount,
                potentialBenefit: totalBenefit._sum.amount || 0
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

/**
 * @desc    Get all students (User Management)
 * @route   GET /api/admin/users
 * @access  Private (Admin Only)
 */
export const getAllUsers = async (req, res) => {
    try {
        const users = await prisma.student.findMany({
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                profileStatus: true,
                state: true,
                createdAt: true
            }
        });
        res.status(200).json({ success: true, count: users.length, data: users });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

/**
 * @desc    Delete a user
 * @route   DELETE /api/admin/users/:id
 * @access  Private (Admin Only)
 */
export const deleteUser = async (req, res) => {
    try {
        await prisma.student.delete({ where: { id: req.params.id } });
        res.status(200).json({ success: true, message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};
