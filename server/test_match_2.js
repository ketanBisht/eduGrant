import { PrismaClient } from '@prisma/client';
import fs from 'fs';
const prisma = new PrismaClient();

async function main() {
  const student = await prisma.student.findFirst();
  if (!student) return;

  const { income, category, state, gender, academicPercentage } = student;
  
  const andFilters = [];

  const filter1 = { OR: [{ maxIncome: { gte: income } }, { maxIncome: null }] };
  const filter2 = { OR: [{ minPercentage: { lte: academicPercentage } }, { minPercentage: null }] };
  const filter3 = { OR: [{ categoryEligible: { has: category } }, { categoryEligible: { has: 'All' } }, { categoryEligible: { isEmpty: true } }] };
  const filter4 = { OR: [{ state: { equals: state, mode: 'insensitive' } }, { state: "All" }, { state: null }] };
  const filter5 = { OR: [{ gender: { equals: gender, mode: 'insensitive' } }, { gender: "All" }, { gender: null }] };

  let out = ``;
  out += `Filter 1 (Income): ${(await prisma.scholarship.findMany({where: filter1})).length}\n`;
  out += `Filter 2 (Percent): ${(await prisma.scholarship.findMany({where: filter2})).length}\n`;
  out += `Filter 3 (Category): ${(await prisma.scholarship.findMany({where: filter3})).length}\n`;
  out += `Filter 4 (State): ${(await prisma.scholarship.findMany({where: filter4})).length}\n`;
  out += `Filter 5 (Gender): ${(await prisma.scholarship.findMany({where: filter5})).length}\n`;

  fs.writeFileSync('test_output_utf8.txt', out, 'utf-8');
}

main().finally(async () => await prisma.$disconnect());
