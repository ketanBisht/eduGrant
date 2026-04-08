import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import prisma from '../config/prisma.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function importScholarships() {
    console.log("🚀 Starting Buddy4Study Data Import...");
    
    const jsonPath = path.join(__dirname, '../data/scholarships.json');
    if (!fs.existsSync(jsonPath)) {
        console.error("❌ File not found: server/data/scholarships.json");
        process.exit(1);
    }

    const rawData = fs.readFileSync(jsonPath, 'utf8');
    const scholarships = JSON.parse(rawData);

    console.log(`📦 Found ${scholarships.length} scholarships in JSON.`);

    let created = 0;
    let skipped = 0;

    for (const item of scholarships) {
        try {
            // Field Mapping & Normalization
            const title = item.title;
            const provider = "Buddy4Study Partner"; // Default provider since JSON lacks specific provider field
            const officialLink = item.link.startsWith('http') ? item.link : `https://www.buddy4study.com${item.link}`;
            
            // Parse Amount from description if possible
            let amount = 0;
            const amountMatch = item.description?.match(/₹\s?([\d,]+)/) || item.description?.match(/INR\s?([\d,]+)/);
            if (amountMatch) {
                amount = parseFloat(amountMatch[1].replace(/,/g, ''));
            } else if (item.description?.toLowerCase().includes("tuition fee waiver")) {
                amount = 50000; // Arbitrary value for waivers
            }

            // Parse Deadline
            let deadline = new Date(new Date().getFullYear(), 11, 31); // Default Dec 31
            if (item.deadline && item.deadline !== "Not specified") {
                const parsedDate = new Date(item.deadline);
                if (!isNaN(parsedDate.getTime())) {
                    deadline = parsedDate;
                }
            }

            // Upsert Logic
            await prisma.scholarship.upsert({
                where: {
                    title_provider: {
                        title: title,
                        provider: provider
                    }
                },
                update: {
                    deadline: deadline,
                    amount: amount || 0,
                    description: `${item.description}\n\nEligibility: ${item.eligibility || 'See official website'}`,
                    officialLink: officialLink,
                    updatedAt: new Date()
                },
                create: {
                    title: title,
                    provider: provider,
                    officialLink: officialLink,
                    amount: amount || 0,
                    deadline: deadline,
                    source: "CORPORATE_CSR",
                    description: `${item.description}\n\nEligibility: ${item.eligibility || 'See official website'}`,
                    verificationStatus: "VERIFIED"
                }
            });

            created++;
            if (created % 100 === 0) console.log(`Processed ${created}...`);

        } catch (error) {
            console.error(`❌ Error importing ${item.title.substring(0, 30)}:`, error.message);
            skipped++;
        }
    }

    console.log(`\n✅ Import Complete!`);
    console.log(`✨ Successfully Processed: ${created}`);
    console.log(`⚠️ Skipped/Errors: ${skipped}`);
}

importScholarships()
    .catch(err => console.error(err))
    .finally(() => prisma.$disconnect());
