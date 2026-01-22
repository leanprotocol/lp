module.exports = {
  datasource: {
    url:"postgresql://neondb_owner:npg_GE6kN2phqIPl@ep-steep-rice-a1ygflad-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
  },
  migrations: {
    seed: 'ts-node --project tsconfig.scripts.json prisma/seed.ts',
  },
};
