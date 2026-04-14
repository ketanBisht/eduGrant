import { PrismaClient } from '@prisma/client';
import fs from 'fs';
const prisma = new PrismaClient();

async function main() {
  const student = await prisma.student.findFirst();
  if (!student) return;

  const { income, category, state, gender, academicPercentage } = student;
  
  const appliedScholarshipIds = await prisma.application.findMany({
    where: { studentId: student.id },
    select: { scholarshipId: true }
  }).then(apps => apps.map(a => a.scholarshipId));

  const where = {
    id: { notIn: appliedScholarshipIds },
    // deadline: { gt: new Date() },
  };

  const andFilters = [];

  if (income !== null && income !== undefined) {
    andFilters.push({ OR: [{ maxIncome: { gte: income } }, { maxIncome: null }, { maxIncome: { isSet: false } }] });
  }
  if (academicPercentage !== null && academicPercentage !== undefined) {
    andFilters.push({ OR: [{ minPercentage: { lte: academicPercentage } }, { minPercentage: null }, { minPercentage: { isSet: false } }] });
  }
  if (category) {
    andFilters.push({ OR: [{ categoryEligible: { has: category } }, { categoryEligible: { has: 'All' } }, { categoryEligible: { isEmpty: true } }] });
  }
  if (state) {
    andFilters.push({ OR: [{ state: { equals: state, mode: 'insensitive' } }, { state: "All" }, { state: null }, { state: { isSet: false } }] });
  }
  if (gender) {
    andFilters.push({ OR: [{ gender: { equals: gender, mode: 'insensitive' } }, { gender: "All" }, { gender: null }, { gender: { isSet: false } }] });
  }

  if (andFilters.length > 0) {
    where.AND = andFilters;
  }

  const eligibleScholarships = await prisma.scholarship.findMany({
    where,
    take: 50,
  });

  const out = `Eligible matches: ${eligibleScholarships.length}\n`;
  fs.writeFileSync('test_match_res.txt', out, 'utf-8');
}

main().finally(async () => await prisma.$disconnect());
