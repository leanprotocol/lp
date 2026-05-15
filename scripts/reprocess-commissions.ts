import 'dotenv/config';
import { prisma } from '../lib/prisma';
import { calculateAndCreateCommission } from '../services/commission-service';

async function main() {
  console.log('Finding SUCCESS payments to reprocess commissions...');
  
  // Find all SUCCESS payments that don't have a commission record
  const payments = await prisma.payment.findMany({
    where: {
      status: 'SUCCESS',
      commission: null,
    },
    include: {
      user: true,
    }
  });

  console.log(`Found ${payments.length} SUCCESS payments with missing commissions.`);
  
  let processed = 0;
  for (const payment of payments) {
    console.log(`Processing payment ${payment.id} for user ${payment.user.mobileNumber}...`);
    try {
      const commission = await calculateAndCreateCommission(payment.id);
      if (commission) {
        console.log(`✅ Commission created: ₹${commission.amount} (${commission.status})`);
        processed++;
      } else {
        console.log(`❌ No pending affiliate lead found for user ${payment.user.mobileNumber}.`);
      }
    } catch (err) {
      console.error(`Failed to process payment ${payment.id}:`, err);
    }
  }

  console.log(`\nDone! Processed ${processed} new commissions.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
