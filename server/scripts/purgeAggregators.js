import prisma from '../config/prisma.js';

async function purgeAggregators() {
    console.log("🧹 Initializing Aggregator Purge...");
    
    try {
        // Target specifically buddy4study links
        const targetPattern = 'buddy4study';
        
        const b4sCount = await prisma.scholarship.count({
            where: {
                officialLink: {
                    contains: targetPattern,
                    mode: 'insensitive'
                }
            }
        });

        console.log(`⚠️ Identifying ${b4sCount} records from Buddy4Study for removal.`);

        if (b4sCount > 0) {
            // Also need to delete applications associated with these scholarships
            // In MongoDB with Prisma, we usually have to handle cascade if not defined
            const scholarshipsToDelete = await prisma.scholarship.findMany({
                where: { officialLink: { contains: targetPattern, mode: 'insensitive' } },
                select: { id: true }
            });
            
            const ids = scholarshipsToDelete.map(s => s.id);

            await prisma.application.deleteMany({
                where: { scholarshipId: { in: ids } }
            });

            await prisma.scholarship.deleteMany({
                where: { id: { in: ids } }
            });

            console.log(`✅ Successfully purged ${b4sCount} Buddy4Study scholarships and their associated applications.`);
        } else {
            console.log("ℹ️ No Buddy4Study records found.");
        }

        // Optional: Clean up other known aggregators if found
        // logic here...

    } catch (error) {
        console.error("❌ Purge Failed:", error.message);
    } finally {
        await prisma.$disconnect();
    }
}

purgeAggregators();
