const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const email = 'daohuynhphongvu2004@gmail.com';
  const user = await prisma.user.findUnique({ where: { email } });
  
  if (user) {
    console.log(`User found. Current role: ${user.role}`);
    await prisma.user.update({
      where: { email },
      data: { role: 'ADMIN' }
    });
    console.log('Role updated to ADMIN successfully.');
  } else {
    console.log(`User ${email} not found in database. The new registration logic will assign ADMIN upon sign up.`);
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
