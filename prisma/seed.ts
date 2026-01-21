import 'dotenv/config';
import { prisma } from '../lib/prisma';
import { hashPassword } from '../lib/auth/password';

const DEFAULT_ADMINS = [
  {
    email: process.env.SEED_ADMIN_EMAIL ?? 'admin@leanhealth.com',
    password: process.env.SEED_ADMIN_PASSWORD ?? 'SuperSecure123!',
    name: process.env.SEED_ADMIN_NAME ?? 'Lean Health Admin',
  },
  {
    email: 'ops@leanhealth.com',
    password: 'OpsSecure123!',
    name: 'Operations Lead',
  },
  {
    email: 'support@leanhealth.com',
    password: 'SupportSecure123!',
    name: 'Member Success',
  },
];

const INSURANCE_PROVIDERS = [
  'Aditya Birla Health Insurance',
  'Aegon Life Insurance',
  'Bajaj Allianz General Insurance',
  'Bharti AXA General Insurance',
  'Canara HSBC Life Insurance',
  'Care Health Insurance',
  'Cholamandalam MS General Insurance',
  'Digit General Insurance',
  'Edelweiss General Insurance',
  'Future Generali India Insurance',
  'Go Digit General Insurance',
  'HDFC ERGO General Insurance',
  'ICICI Lombard General Insurance',
  'IFFCO Tokio General Insurance',
  'Kotak Mahindra General Insurance',
  'Liberty General Insurance',
  'ManipalCigna Health Insurance',
  'Max Bupa Health Insurance',
  'National Insurance Company',
  'Niva Bupa Health Insurance',
  'Reliance General Insurance',
  'Royal Sundaram General Insurance',
  'SBI General Insurance',
  'Shriram General Insurance',
  'Star Health & Allied Insurance',
  'TATA AIG General Insurance',
  'The New India Assurance',
  'The Oriental Insurance Company',
  'United India Insurance',
];

async function seedAdmins() {
  console.log('\n👤 Seeding admin profiles...');
  for (const admin of DEFAULT_ADMINS) {
    const normalizedEmail = admin.email.toLowerCase();
    const existing = await prisma.admin.findUnique({ where: { email: normalizedEmail } });

    if (existing) {
      await prisma.admin.update({
        where: { id: existing.id },
        data: { name: admin.name, isActive: true, role: 'admin' },
      });
      console.log(`   • Updated existing admin: ${normalizedEmail}`);
      continue;
    }

    const hashedPassword = await hashPassword(admin.password);
    await prisma.admin.create({
      data: {
        email: normalizedEmail,
        name: admin.name,
        password: hashedPassword,
        role: 'admin',
        isActive: true,
      },
    });
    console.log(`   • Created admin: ${normalizedEmail} (password: ${admin.password})`);
  }
}

async function seedInsuranceProviders() {
  console.log('\n🏥 Seeding insurance providers...');
  for (const [index, name] of INSURANCE_PROVIDERS.entries()) {
    await prisma.insuranceProvider.upsert({
      where: { name },
      update: {
        isActive: true,
        displayOrder: index + 1,
      },
      create: {
        name,
        coveragePercentage: 0,
        description: null,
        displayOrder: index + 1,
      },
    });
  }
  console.log(`   • Ensured ${INSURANCE_PROVIDERS.length} providers are available`);
}

async function main() {
  try {
    await seedAdmins();
    await seedInsuranceProviders();
    console.log('\n✅  Prisma seeding completed successfully.\n');
  } catch (error) {
    console.error('\n❌  Prisma seeding failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
