import puppeteer from 'puppeteer';
import prisma from '../config/prisma.js';

async function scrapeNSP() {
    const browser = await puppeteer.launch({ headless: true });
    try {
        const page = await browser.newPage();
        console.log("Navigating to NSP All-Scholarships page...");
        
        await page.goto('https://scholarships.gov.in/All-Scholarships', {
            waitUntil: 'networkidle2',
            timeout: 60000
        });

        // Wait for accordions to load
        await page.waitForSelector('.accordion-item');

        const data = await page.evaluate(() => {
            const items = [];
            const accordions = document.querySelectorAll('.accordion-item');

            accordions.forEach(acc => {
                const ministry = acc.querySelector('.accordion-button')?.innerText.trim();
                const schemes = acc.querySelectorAll('.card-body .row');

                schemes.forEach(scheme => {
                    const title = scheme.querySelector('h6')?.innerText.trim();
                    const details = scheme.innerText.trim();
                    
                    if (title) {
                        items.push({
                            title,
                            provider: ministry,
                            eligibility: details, // Rough extraction of requirements
                            link: 'https://scholarships.gov.in/'
                        });
                    }
                });
            });
            return items;
        });

        console.log(`Found ${data.length} potential schemes on NSP.`);

        let count = 0;
        for (const item of data) {
            try {
                // Check if already exists to avoid duplicates
                const existing = await prisma.scholarship.findFirst({
                    where: { title: item.title }
                });

                if (!existing) {
                    await prisma.scholarship.create({
                        data: {
                            title: item.title,
                            provider: item.provider || "National Scholarship Portal",
                            officialLink: item.link,
                            amount: 0, // NSP amounts vary, usually set to 0 or manual check
                            deadline: new Date(new Date().setFullYear(new Date().getFullYear() + 1)), // Default 1yr
                            source: "GOVERNMENT",
                            verificationStatus: "PENDING",
                            minPercentage: 50, // Common default
                            maxIncome: 250000, // Common default for NSP
                        }
                    });
                    count++;
                }
            } catch (err) {
                console.error(`Error saving NSP scheme: ${item.title}`, err.message);
            }
        }

        console.log(`NSP Scraper finished. Newly added: ${count}`);

    } catch (error) {
        console.error("NSP Scraper encountered an error:", error);
    } finally {
        await browser.close();
        await prisma.$disconnect();
    }
}

scrapeNSP();
