
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const scholarships = [
  {
    title: "Mukhyamantri Kanya Utthan Yojana (Degree)",
    provider: "Bihar Government (e-Kalyan)",
    officialLink: "https://medhasoft.bih.nic.in/",
    amount: 50000,
    deadline: new Date("2026-12-31"),
    source: "GOVERNMENT",
    description: "Financial assistance to girls who have graduated from recognized universities in Bihar.",
    minPercentage: 60,
    maxIncome: null,
    categoryEligible: ["General", "OBC", "SC", "ST", "EWS"],
    state: "Bihar",
    gender: "Female"
  },
  {
    title: "Mukhyamantri Balika Protsahan Yojana (12th)",
    provider: "Bihar Government (e-Kalyan)",
    officialLink: "https://medhasoft.bih.nic.in/",
    amount: 25000,
    deadline: new Date("2026-12-15"),
    source: "GOVERNMENT",
    description: "Incentive for girls who pass class 12th from Bihar School Examination Board.",
    minPercentage: null,
    maxIncome: null,
    categoryEligible: ["General", "OBC", "SC", "ST", "EWS"],
    state: "Bihar",
    gender: "Female"
  },
  {
    title: "Tata Trusts Medical and Healthcare Scholarship",
    provider: "Tata Trusts",
    officialLink: "https://www.tatatrusts.org/our-work/individual-grants-programme/education-grants",
    amount: 50000,
    deadline: new Date("2026-11-30"),
    source: "CORPORATE_CSR",
    description: "Supports students pursuing professional medical courses like MBBS, BDS, Nursing, etc.",
    minPercentage: 60,
    maxIncome: 500000,
    categoryEligible: ["General", "OBC", "SC", "ST", "EWS"],
    state: "All",
    gender: "All"
  },
  {
    title: "Tata Trusts Professional Enhancement Grant",
    provider: "Tata Trusts",
    officialLink: "https://www.tatatrusts.org/",
    amount: 30000,
    deadline: new Date("2026-10-31"),
    source: "CORPORATE_CSR",
    description: "Grants for individuals looking to enhance their professional skills through short-term courses.",
    minPercentage: 50,
    maxIncome: 400000,
    categoryEligible: ["General", "OBC", "SC", "ST", "EWS"],
    state: "All",
    gender: "All"
  },
  {
    title: "FFE Scholarship Program",
    provider: "Foundation for Excellence",
    officialLink: "https://ffe.org/apply/",
    amount: 50000,
    deadline: new Date("2027-01-15"),
    source: "NGO",
    description: "Financial support for 1st-year students pursuing B.E./B.Tech, MBBS, or 5-Year Integrated Law.",
    minPercentage: 70,
    maxIncome: 300000,
    categoryEligible: ["General", "OBC", "SC", "ST", "EWS"],
    state: "All",
    gender: "All"
  },
  {
    title: "Ishan Uday Special Scholarship (NER)",
    provider: "University Grants Commission (UGC)",
    officialLink: "https://scholarships.gov.in/",
    amount: 64800,
    deadline: new Date("2026-12-31"),
    source: "GOVERNMENT",
    description: "Special scholarship for students from the North Eastern Region of India for general/professional degree courses.",
    minPercentage: null,
    maxIncome: 450000,
    categoryEligible: ["General", "OBC", "SC", "ST", "EWS"],
    state: "NER States",
    gender: "All"
  },
  {
    title: "PG Indira Gandhi Scholarship (Single Girl Child)",
    provider: "University Grants Commission (UGC)",
    officialLink: "https://scholarships.gov.in/",
    amount: 36200,
    deadline: new Date("2026-12-20"),
    source: "GOVERNMENT",
    description: "Promoting postgraduate education for single girl children in families.",
    minPercentage: null,
    maxIncome: null,
    categoryEligible: ["General", "OBC", "SC", "ST", "EWS"],
    state: "All",
    gender: "Female"
  },
  {
    title: "Pragati Scholarship Scheme for Girls",
    provider: "AICTE",
    officialLink: "https://www.aicte-india.org/schemes/students-development-schemes",
    amount: 50000,
    deadline: new Date("2026-12-31"),
    source: "GOVERNMENT",
    description: "Empowering young girls by providing financial assistance to pursue technical education.",
    minPercentage: null,
    maxIncome: 800000,
    categoryEligible: ["General", "OBC", "SC", "ST", "EWS"],
    state: "All",
    gender: "Female"
  },
  {
    title: "Saksham Scholarship Scheme (PwD)",
    provider: "AICTE",
    officialLink: "https://www.aicte-india.org/schemes/students-development-schemes",
    amount: 50000,
    deadline: new Date("2026-12-31"),
    source: "GOVERNMENT",
    description: "Specially-abled students pursuing technical degree or diploma courses.",
    minPercentage: null,
    maxIncome: 800000,
    categoryEligible: ["General", "OBC", "SC", "ST", "EWS"],
    state: "All",
    gender: "All"
  },
  {
    title: "AICTE PG Scholarship (GATE/GPAT)",
    provider: "AICTE",
    officialLink: "https://www.aicte-india.org/",
    amount: 148800,
    deadline: new Date("2026-12-31"),
    source: "GOVERNMENT",
    description: "Monthly stipend of ₹12,400 for GATE/GPAT qualified students pursuing M.Tech/M.Pharm.",
    minPercentage: null,
    maxIncome: null,
    categoryEligible: ["General", "OBC", "SC", "ST", "EWS"],
    state: "All",
    gender: "All"
  }
];

async function main() {
  console.log("Start seeding scholarships...");
  for (const s of scholarships) {
    const scholarship = await prisma.scholarship.upsert({
      where: {
        title_provider: {
          title: s.title,
          provider: s.provider
        }
      },
      update: s,
      create: s,
    });
    console.log(`Created/Updated: ${scholarship.title}`);
  }
  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
