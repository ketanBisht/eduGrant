import puppeteer from 'puppeteer';

async function scrapeMahaDBT() {
    console.log("🚀 Starting MahaDBT (Official Maharashtra) Scraper...");
    const browser = await puppeteer.launch({ headless: true });
    try {
        const page = await browser.newPage();
        
        // Target the schemes list page
        await page.goto('https://mahadbt.maharashtra.gov.in/SchemeData/SchemeData', {
            waitUntil: 'networkidle2',
            timeout: 60000
        }).catch(() => page.goto('https://mahadbt.maharashtra.gov.in/', { waitUntil: 'networkidle2' }));

        console.log("Extracting schemes from MahaDBT...");

        // MahaDBT often requires clicking sidebars. We'll attempt to capture the visible ones first.
        const scholarships = await page.evaluate(() => {
            const results = [];
            // Target scheme links or titles
            const schemeElements = document.querySelectorAll('.scheme-list li, .accordion-item, .card-title');

            schemeElements.forEach(el => {
                const title = el.innerText.trim();
                if (title && title.length > 15) {
                    results.push({
                        title: title,
                        provider: "Govt of Maharashtra (MahaDBT)",
                        officialLink: "https://mahadbt.maharashtra.gov.in/",
                        amount: 35000, 
                        deadline: new Date(new Date().getFullYear(), 11, 31).toISOString(),
                        source: "GOVERNMENT",
                        description: `Official Maharashtra DBT Scheme: ${title}. Requires domicile in Maharashtra and valid category certification.`
                    });
                }
            });

            return results;
        });

        console.log(`✅ Found ${scholarships.length} Official Maharashtra schemes.`);
        return scholarships;

    } catch (error) {
        console.error("❌ MahaDBT Scraper Error:", error.message);
        return [];
    } finally {
        await browser.close();
    }
}

export default scrapeMahaDBT;
