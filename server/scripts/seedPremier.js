import prisma from "../config/prisma.js";

const scholarships = [
    {
        title: "Sitaram Jindal Foundation Scholarship",
        provider: "Sitaram Jindal Foundation",
        amount: 24000,
        deadline: new Date("2026-10-31"),
        officialLink: "https://www.sitaramjindalfoundation.org/scholarships-for-students-in-bangalore.php",
        source: "CORPORATE_CSR",
        description: "Scholarships for students pursuing UG/PG courses, with a focus on merit and financial need.",
        categoryEligible: ["All"],
        state: "Karnataka",
        gender: "All"
    },
    {
        title: "Reliance Foundation Undergraduate Scholarship",
        provider: "Reliance Foundation",
        amount: 200000,
        deadline: new Date("2026-02-15"),
        officialLink: "https://reliancefoundation.org/",
        source: "CORPORATE_CSR",
        description: "Merit-cum-means scholarship for UG students across all streams in India.",
        categoryEligible: ["All"],
        state: "All",
        gender: "All"
    },
    {
        title: "ONGC Merit Scholarship for SC/ST Students",
        provider: "ONGC",
        amount: 48000,
        deadline: new Date("2026-03-31"),
        officialLink: "https://ongcscholar.org/",
        source: "GOVERNMENT",
        description: "Exclusively for SC/ST students pursuing professional courses in Engineering and MBBS.",
        categoryEligible: ["SC", "ST"],
        state: "All",
        gender: "All"
    },
    {
        title: "Aditya Birla Scholars Program",
        provider: "Aditya Birla Group",
        amount: 175000,
        deadline: new Date("2026-01-31"),
        officialLink: "https://www.adityabirlascholars.net/",
        source: "CORPORATE_CSR",
        description: "Prestigious scholarship for students in top management, law, and engineering institutes.",
        categoryEligible: ["All"],
        state: "All",
        gender: "All"
    },
    {
        title: "Azim Premji University Undergraduate Scholarship",
        provider: "Azim Premji Foundation",
        amount: 150000,
        deadline: new Date("2026-04-30"),
        officialLink: "https://azimpremjifoundation.org/",
        source: "NGO",
        description: "Need-based scholarships covering tuition and accommodation for UG programs.",
        categoryEligible: ["All"],
        state: "All",
        gender: "All"
    },
    {
        title: "HDFC Bank Parivartan ECSS Scholarship",
        provider: "HDFC Bank",
        amount: 75000,
        deadline: new Date("2026-05-15"),
        officialLink: "https://www.parivartanecss.com/",
        source: "CORPORATE_CSR",
        description: "Scholarship for underprivileged students from Class 1 to UG/PG levels.",
        categoryEligible: ["All"],
        state: "All",
        gender: "All"
    }
];

async function seed() {
    try {
        console.log("Seeding premier scholarships...");
        for (const s of scholarships) {
            await prisma.scholarship.upsert({
                where: { title_provider: { title: s.title, provider: s.provider } },
                update: s,
                create: s
            });
        }
        console.log("Seeding complete! ✅");
        process.exit(0);
    } catch (error) {
        console.error("Seed failed:", error);
        process.exit(1);
    }
}

seed();
