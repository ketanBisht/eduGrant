// const puppeteer = require('puppeteer');
import puppeteer from 'puppeteer';

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

            const lastUpdated =
                card.querySelector('.Listing_categoriesRight__7Zjyu span')?.innerText.trim();

            scholarships.push({
                title,
                link,
                deadline,
                award,
                eligibility,
                lastUpdated,
            });
        });

        return scholarships;
    });

    console.log(data);

    await browser.close();
}

scrapeScholarships();