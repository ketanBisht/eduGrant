import prisma from "../config/prisma.js";

async function fixDeadlines() {
    try {
        console.log("Updating deadlines for expired scholarships...");
        
        const now = new Date();
        const futureDate = new Date('2026-12-31T23:59:59Z');

        const result = await prisma.scholarship.updateMany({
            where: {
                deadline: {
                    lte: now
                }
            },
            data: {
                deadline: futureDate
            }
        });

        console.log(`Successfully updated ${result.count} scholarships to expire on Dec 31, 2026.`);
        process.exit(0);
    } catch (error) {
        console.error("Failed to update deadlines:", error);
        process.exit(1);
    }
}

fixDeadlines();
