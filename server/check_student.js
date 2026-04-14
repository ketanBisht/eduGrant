import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const student = await prisma.student.findFirst();
  console.log('Sample Student Profile:', JSON.stringify(student, null, 2));
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
