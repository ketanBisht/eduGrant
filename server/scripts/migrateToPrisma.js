import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import prisma from '../config/prisma.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const parseDate = (dateStr) => {
    if (!dateStr || dateStr.toLowerCase() === 'not specified') {
        // Default to 1 year from now if not specified
        const date = new Date();
        date.setFullYear(date.getFullYear() + 1);
        return date;
    }
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? new Date() : date;
};

const extractAmount = (desc) => {
    if (!desc) return 0;
    const match = desc.match(/₹|INR|SGD|£|USD|AUD|CAD|EUR|₹\s*(\d+(?:,\d+)*(?:\.\d+)?)/);
    // Rough extraction - improvement needed for production
    const numMatch = desc.match(/(\d+(?:,\d+)*(?:\.\d+)?)/);
    if (numMatch) {
        return parseFloat(numMatch[0].replace(/,/g, ''));
    }
    return 0;
};

async function migrate() {
    try {
        const dataPath = path.join(__dirname, '../data/scholarships.json');
        const rawData = await fs.readFile(dataPath, 'utf-8');
        const scholarships = JSON.parse(rawData);

        console.log(`Starting migration of ${scholarships.length} scholarships...`);

        let count = 0;
        for (const s of scholarships) {
            try {
                // Determine source type
                let source = "GOVERNMENT";
                if (s.title.toLowerCase().includes('tata') || s.title.toLowerCase().includes('hdfc') || s.title.toLowerCase().includes('icici')) {
                    source = "CORPORATE_CSR";
                }

                await prisma.scholarship.create({
                    data: {
                        title: s.title,
                        provider: s.source || "Buddy4Study",
                        officialLink: s.link.startsWith('http') ? s.link : `https://www.buddy4study.com${s.link}`,
                        amount: extractAmount(s.description),
                        deadline: parseDate(s.deadline),
                        source: source,
                        verificationStatus: "APPROVED", // Auto-approve legacy data
                        minPercentage: 0,
                        maxIncome: 800000, // Default limit for many Indian scholarships
                    }
                });
                count++;
                if (count % 50 === 0) console.log(`Migrated ${count}...`);
            } catch (err) {
                console.error(`Error migrating scholarship: ${s.title}`, err.message);
            }
        }

        console.log(`Migration complete! Successfully migrated ${count} scholarships.`);
    } catch (error) {
        console.error("Migration failed:", error);
    } finally {
        await prisma.$disconnect();
    }
}

migrate();
