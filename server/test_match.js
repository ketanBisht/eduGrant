import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const student = await prisma.student.findFirst();
  if (!student) return console.log("No student");

  const { income, category, state, gender, academicPercentage } = student;
  console.log("Student filters:", { income, category, state, gender, academicPercentage });

  const andFilters = [];

  if (income !== null && income !== undefined) {
    andFilters.push({ OR: [{ maxIncome: { gte: income } }, { maxIncome: null }] });
  }
  if (academicPercentage !== null && academicPercentage !== undefined) {
    andFilters.push({ OR: [{ minPercentage: { lte: academicPercentage } }, { minPercentage: null }] });
  }
  if (category) {
    andFilters.push({ OR: [{ categoryEligible: { has: category } }, { categoryEligible: { has: 'All' } }, { categoryEligible: { equals: [] } }, { categoryEligible: { isEmpty: true } }] });
  }
  if (state) {
    andFilters.push({ OR: [{ state: { equals: state, mode: 'insensitive' } }, { state: "All" }, { state: null }] });
  }
  if (gender) {
    andFilters.push({ OR: [{ gender: { equals: gender, mode: 'insensitive' } }, { gender: "All" }, { gender: null }] });
  }

  const where = {};
  if (andFilters.length > 0) {
    where.AND = andFilters;
  }

  const matches = await prisma.scholarship.findMany({ where });
  console.log(`Found ${matches.length} matches with AND filters.`);
  for(let f of andFilters) {
     const p = await prisma.scholarship.findMany({ where: f });
     console.log(`Filter ${JSON.stringify(f).substring(0, 50)}... found: ${p.length}`);
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
