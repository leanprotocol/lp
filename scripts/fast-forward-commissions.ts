import 'dotenv/config';
import { prisma } from '../lib/prisma';

async function main() {
  console.log('Fast-forwarding PENDING commissions...');
  
  // Update all PENDING commissions to be eligible immediately
  const result = await prisma.commission.updateMany({
    where: { status: 'PENDING' },
    data: { eligibleAt: new Date(Date.now() - 1000) } // Set to 1 second ago
  });

  console.log(`Updated ${result.count} commissions.`);
  console.log('Now you can visit http://localhost:3002/api/admin/commissions/process-eligible to process them to ELIGIBLE state.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
