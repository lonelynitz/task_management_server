import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

let prisma;

function getPrisma() {
  if (!prisma) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) throw new Error('DATABASE_URL environment variable is required');
    const url = connectionString.includes('sslmode=') ? connectionString : connectionString + '&sslmode=no-verify';
    const pool = new pg.Pool({ connectionString: url });
    const adapter = new PrismaPg(pool);
    prisma = new PrismaClient({ adapter });
  }
  return prisma;
}

export default new Proxy({}, {
  get(_, prop) {
    return getPrisma()[prop];
  },
});
