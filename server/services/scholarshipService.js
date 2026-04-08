import prisma from '../config/prisma.js';

export const getAllScholarships = async () => {
    try {
        return await prisma.scholarship.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        });
    } catch (error) {
        console.error("Error fetching scholarships from database:", error);
        throw new Error("Could not retrieve scholarships data");
    }
};

export const getScholarshipById = async (id) => {
    try {
        return await prisma.scholarship.findUnique({
            where: { id }
        });
    } catch (error) {
        console.error(`Error fetching scholarship with ID ${id}:`, error);
        throw new Error("Could not retrieve scholarship");
    }
};
