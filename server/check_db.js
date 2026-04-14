import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const count = await prisma.scholarship.count();
  console.log(`Total scholarships: ${count}`);
  
  if (count > 0) {
    const sample = await prisma.scholarship.findFirst();
    console.log('Sample Scholarship:', JSON.stringify(sample, null, 2));
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
