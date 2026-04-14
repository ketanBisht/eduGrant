import { PrismaClient } from '@prisma/client';
import fs from 'fs';
const prisma = new PrismaClient();

async function main() {
  const f1 = await prisma.scholarship.findMany({ where: { maxIncome: null }});
  const f2 = await prisma.scholarship.findMany({ where: { maxIncome: { isSet: false } }});
  const f3 = await prisma.scholarship.findMany({ where: { OR: [ { maxIncome: null }, { maxIncome: { isSet: false } } ] }});
  
  let out = `maxIncome: null -> ${f1.length}\nmaxIncome: isSet: false -> ${f2.length}\nBoth -> ${f3.length}\n`;
  fs.writeFileSync('test_db_2.txt', out, 'utf-8');
}

main().finally(async () => await prisma.$disconnect());
