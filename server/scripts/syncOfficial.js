import prisma from '../config/prisma.js';
import scrapeNSP from './scraping/nspScraper.js';
import scrapeHDFC from './scraping/hdfcScraper.js';
import scrapeMahaDBT from './scraping/mahaDBTScraper.js';

async function syncOfficialSources() {
    console.log("🔄 Starting Official Source Synchronization...");
    
    try {
        const [nspData, hdfcData, mahaData] = await Promise.all([
            scrapeNSP(),
            scrapeHDFC(),
            scrapeMahaDBT()
        ]);

        const allData = [...nspData, ...hdfcData, ...mahaData];
        console.log(`📦 Aggregated ${allData.length} total schemes from official sources.`);

        let newRecords = 0;
        let updatedRecords = 0;

        for (const scholarship of allData) {
            try {
                // Upsert logic: Update if title + provider matches, otherwise create
                // We use title and provider as a composite key (rough)
                const existing = await prisma.scholarship.findFirst({
                    where: {
                        AND: [
                            { title: scholarship.title },
                            { provider: scholarship.provider }
                        ]
                    }
                });

                if (existing) {
                    await prisma.scholarship.update({
                        where: { id: existing.id },
                        data: {
                            deadline: scholarship.deadline,
                            amount: scholarship.amount,
                            officialLink: scholarship.officialLink,
                            source: scholarship.source,
                            updatedAt: new Date()
                        }
                    });
                    updatedRecords++;
                } else {
                    await prisma.scholarship.create({
                        data: {
                            ...scholarship,
                            verificationStatus: "VERIFIED" // Official sources are pre-verified
                        }
                    });
                    newRecords++;
                }
            } catch (err) {
                console.error(`Skipping scholarship ${scholarship.title}:`, err.message);
            }
        }

        console.log(`✅ Synchronization Complete.`);
        console.log(`✨ Newly Created: ${newRecords}`);
        console.log(`🔄 Updated: ${updatedRecords}`);

    } catch (error) {
        console.error("❌ Sync Error:", error.message);
    } finally {
        await prisma.$disconnect();
    }
}

syncOfficialSources();
