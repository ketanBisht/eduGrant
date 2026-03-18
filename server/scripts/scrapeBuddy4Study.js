import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function scrapeScholarships() {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.goto('https://www.buddy4study.com/scholarships', {
        waitUntil: 'networkidle2',
    });

    // wait for cards to load
    await page.waitForSelector('.Listing_categoriesBox__CiGvQ');

    const data = await page.evaluate(() => {
        const cards = document.querySelectorAll('.Listing_categoriesBox__CiGvQ');

        const scholarships = [];

        cards.forEach((card) => {
            const title =
                card.querySelector('.Listing_scholarshipName__VLFMj p')?.innerText.trim();

            const link = card.getAttribute('href');

            const deadline =
                card.querySelector('.Listing_calendarDate__WCgKV p:last-child')?.innerText.trim();

            const award =
                card.querySelectorAll('.Listing_awardCont__qnjQK')[0]
                    ?.querySelector('span')?.innerText.trim();

            const eligibility =
                card.querySelectorAll('.Listing_awardCont__qnjQK')[1]
                    ?.querySelector('span')?.innerText.trim();

            scholarships.push({
                title,
                link,
                deadline,
                award,
                eligibility,
            });
        });

        return scholarships;
    });

    const validScholarships = data
        .filter((s) => s.title && s.link)
        .map((s) => ({
            title: s.title || '',
            description: s.award || s.title || '',
            eligibility: s.eligibility || 'See details',
            deadline: s.deadline || 'Not specified',
            link: s.link || '',
            source: "Buddy4Study",
            scrapedAt: new Date().toISOString()
        }));

    const dataDirPath = path.join(__dirname, '../data');
    if (!fs.existsSync(dataDirPath)) {
        fs.mkdirSync(dataDirPath, { recursive: true });
    }

    const jsonPath = path.join(dataDirPath, 'scholarships.json');
    fs.writeFileSync(jsonPath, JSON.stringify(validScholarships, null, 2));

    console.log(`Successfully scraped ${validScholarships.length} scholarships to JSON.`);

    await browser.close();
}

scrapeScholarships();