require('dotenv').config({ path: '.env.local' });

module.exports = {
  datasource: {
    url: process.env.DATABASE_URL,
  },
  migrations: {
    seed: 'ts-node --project tsconfig.scripts.json prisma/seed.ts',
  },
};
