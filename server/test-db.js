import prisma from "./config/prisma.js";

async function testPrisma() {
    try {
        console.log("Testing Prisma connection...");
        const count = await prisma.scholarship.count();
        console.log(`Connection successful. Scholarship count: ${count}`);
        
        const latest = await prisma.scholarship.findMany({ take: 1 });
        console.log("Latest scholarship fetched:", latest[0]?.title);
        
        process.exit(0);
    } catch (error) {
        console.error("Prisma test failed!");
        console.error(error);
        process.exit(1);
    }
}

testPrisma();
