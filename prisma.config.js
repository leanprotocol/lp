module.exports = {
  datasource: {
    url: "postgresql://formbuilder_owner:cDWfo2C4Ekxp@ep-gentle-cake-a5ogs6sc-pooler.us-east-2.aws.neon.tech/test?sslmode=require&channel_binding=require",
  },
  migrations: {
    seed: 'ts-node --project tsconfig.scripts.json prisma/seed.ts',
  },
};
