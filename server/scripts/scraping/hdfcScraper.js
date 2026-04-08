import puppeteer from 'puppeteer';

async function scrapeHDFC() {
    console.log("🚀 Starting HDFC Parivartan Scraper...");
    const browser = await puppeteer.launch({ headless: true });
    try {
        const page = await browser.newPage();
        
        // HDFC Parivartan specifically lists their scholarship tiers
        // Wait for potential dynamic loading of scholarships section
        await page.waitForSelector('#scholarships, .accordion, .accordion-button', { timeout: 10000 }).catch(() => console.log("Timeout waiting for specific HDFC selectors, trying general search..."));

        const scholarships = await page.evaluate(() => {
            const results = [];
            // Target the main container and find all accordion triggers
            const accordionButtons = document.querySelectorAll('#scholarships .accordion-button, .accordion-button, h3.accordion-header button');

            accordionButtons.forEach(button => {
                const title = button.innerText.trim();
                // The body is usually the next sibling or a sibling's child
                const card = button.closest('.card') || button.closest('.accordion-item') || button.parentElement.parentElement;
                const body = card ? card.innerText : "";
                
                // Deadline extraction
                const deadlineMatch = body.match(/Deadline:?\s*([\d\w\s,-]+)/i);
                let deadlineDate = new Date();
                
                if (deadlineMatch) {
                    const rawDate = deadlineMatch[1].trim();
                    // Handle DD-MM-YYYY or DD/MM/YYYY
                    const parts = rawDate.match(/(\d{1,2})[-/](\d{1,2})[-/](\d{4})/);
                    if (parts) {
                        deadlineDate = new Date(`${parts[3]}-${parts[2]}-${parts[1]}`);
                    } else {
                        deadlineDate = new Date(rawDate);
                    }
                } else {
                    deadlineDate = new Date(new Date().getFullYear(), 11, 31);
                }

                if (title && title.toLowerCase().includes('scholarship')) {
                    results.push({
                        title: title,
                        provider: "HDFC Bank (Parivartan)",
                        officialLink: "https://www.parivartanecss.com/",
                        amount: amount,
                        deadline: (isNaN(deadlineDate.getTime()) ? new Date(new Date().getFullYear(), 11, 31) : deadlineDate).toISOString(),
                        source: "CORPORATE_CSR",
                        description: body.substring(0, 800)
                    });
                }
            });

            return results;
        });

        console.log(`✅ Found ${scholarships.length} HDFC scholarships.`);
        return scholarships;

    } catch (error) {
        console.error("❌ HDFC Scraper Error:", error.message);
        return [];
    } finally {
        await browser.close();
    }
}

export default scrapeHDFC;

// Self-run for testing if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    scrapeHDFC().then(data => console.log(JSON.stringify(data, null, 2)));
}
