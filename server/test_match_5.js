import { PrismaClient } from '@prisma/client';
import fs from 'fs';
const prisma = new PrismaClient();

async function main() {
  try {
    const student = await prisma.student.findFirst();
    if (!student) return;

    const { category } = student;
    const where = {};
    const andFilters = [];

    if (category) {
      andFilters.push({ OR: [{ categoryEligible: { has: category } }, { categoryEligible: { has: 'All' } }, { categoryEligible: { isEmpty: true } }] });
    }

    if (andFilters.length > 0) {where.AND = andFilters;}

    const eligibleScholarships = await prisma.scholarship.findMany({ where, take: 50 });
    console.log("Success: ", eligibleScholarships.length);
  } catch(e) {
    fs.writeFileSync('error_clean_2.txt', e.message, 'utf-8');
  }
}

main().finally(async () => await prisma.$disconnect());
