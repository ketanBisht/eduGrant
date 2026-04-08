import puppeteer from 'puppeteer';

const INDIAN_STATES = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", 
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", 
    "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", 
    "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", 
    "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", 
    "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi", "Chandigarh", "Ladakh", "Jammu and Kashmir"
];

async function scrapeNSP() {
    console.log("🚀 Starting NSP (Official) Scraper...");
    const browser = await puppeteer.launch({ headless: true });
    try {
        const page = await browser.newPage();
        
        // Target the All Scholarships page which lists schemes by ministry
        await page.goto('https://scholarships.gov.in/All-Scholarships', {
            waitUntil: 'networkidle2',
            timeout: 60000
        });

        console.log("Expanding Ministry accordions on NSP...");

        // Expand all accordions to get access to specific schemes
        await page.evaluate(async () => {
            const buttons = document.querySelectorAll('.accordion-button.collapsed');
            for (const btn of buttons) {
                btn.click();
                await new Promise(r => setTimeout(r, 500)); // Small delay for animation
            }
        });

        const scholarships = await page.evaluate((INDIAN_STATES) => {
            const results = [];
            const ministries = document.querySelectorAll('.accordion-item');

            ministries.forEach(ministry => {
                const ministryName = ministry.querySelector('.accordion-button')?.innerText.trim();
                const collapseSec = ministry.querySelector('.accordion-collapse');
                
                if (collapseSec) {
                    // NSP schemes are often in rows or specific divs inside the collapse
                    const schemes = collapseSec.querySelectorAll('.row'); // Based on recent browsing

                    schemes.forEach(scheme => {
                        const titleEl = scheme.querySelector('h6, .card-title, b');
                        const title = titleEl?.innerText.trim();
                        
                        const fullText = scheme.innerText;
                        
                        // Intelligent Category Extraction
                        const categories = [];
                        if (fullText.match(/SC/i)) categories.push("SC");
                        if (fullText.match(/ST/i)) categories.push("ST");
                        if (fullText.match(/OBC/i)) categories.push("OBC");
                        if (fullText.match(/EWS/i)) categories.push("EWS");
                        if (categories.length === 0) categories.push("All");

                        // Percentage Extraction (e.g., 50% or 60% or 80%)
                        const percMatch = fullText.match(/(\d{2})%/);
                        const minPerc = percMatch ? parseFloat(percMatch[1]) : 50;

                        // Gender Extraction
                        let gender = "All";
                        if (fullText.match(/Girls|Female/i)) gender = "Female";
                        if (fullText.match(/Boys|Male/i) && !fullText.match(/Girls|Female/i)) gender = "Male";

                        // State Extraction (NSP Central schemes are 'All', State schemes have state names)
                        let state = "All";
                        const stateMatches = INDIAN_STATES.filter(s => fullText.includes(s));
                        if (stateMatches.length > 0) state = stateMatches[0];

                        // Search for the specific deadline text found in debugging
                        const dateMatch = fullText.match(/(?:Student Application Closed on :|Closing Date:|Student Application Open till :)\s*([\d\w\s,-]+)/i);
                        
                        let deadline = new Date();
                        if (dateMatch) {
                            const rawDate = dateMatch[1].trim();
                            const parts = rawDate.match(/(\d{1,2})[-/](\d{1,2})[-/](\d{4})/);
                            if (parts) {
                                deadline = new Date(`${parts[3]}-${parts[2]}-${parts[1]}`);
                            } else {
                                deadline = new Date(rawDate);
                            }
                        } else {
                            deadline = new Date(new Date().getFullYear(), 11, 31);
                        }

                        if (title && title.length > 10) {
                            results.push({
                                title: title,
                                provider: ministryName || "Govt of India",
                                officialLink: "https://scholarships.gov.in/All-Scholarships",
                                amount: 25000, 
                                deadline: (isNaN(deadline.getTime()) ? new Date(new Date().getFullYear(), 11, 31) : deadline).toISOString(),
                                source: "GOVERNMENT",
                                description: fullText.substring(0, 800),
                                minPercentage: minPerc,
                                categoryEligible: categories,
                                gender: gender,
                                state: state,
                                maxIncome: 250000 // Default for most NSP schemes
                            });
                        }
                    });
                }
            });

            return results;
        }, INDIAN_STATES);

        console.log(`✅ Found ${scholarships.length} Official Government schemes on NSP.`);
        return scholarships;

    } catch (error) {
        console.error("❌ NSP Scraper Error:", error.message);
        return [];
    } finally {
        await browser.close();
    }
}

export default scrapeNSP;

if (import.meta.url === `file://${process.argv[1]}`) {
    scrapeNSP().then(data => console.log(JSON.stringify(data, null, 2)));
}
