import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const scholarships = await prisma.scholarship.findMany();
  console.log(`Updating ${scholarships.length} scholarships with realistic scattered deadlines...`);
  
  for (const s of scholarships) {
    // Generate a random number of days between 2 to 180 days from now
    const randomDays = Math.floor(Math.random() * (180 - 2 + 1)) + 2;
    
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + randomDays);
    // Set time to end of day
    futureDate.setHours(23, 59, 59, 999);
    
    await prisma.scholarship.update({
      where: { id: s.id },
      data: { deadline: futureDate }
    });
  }
  
  console.log('All deadlines randomized successfully.');
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
