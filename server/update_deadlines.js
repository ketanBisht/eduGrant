import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const scholarships = await prisma.scholarship.findMany();
  console.log(`Updating ${scholarships.length} scholarships...`);
  
  const futureDate = new Date('2026-12-31T23:59:59Z');
  
  for (const s of scholarships) {
    await prisma.scholarship.update({
      where: { id: s.id },
      data: { deadline: futureDate }
    });
  }
  
  console.log('All deadlines moved to Dec 2026.');
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
