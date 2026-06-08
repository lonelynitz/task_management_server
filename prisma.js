import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL || 'postgres://avnadmin:AVNS_j4I4YYXnAq285V_-SI4@pg-1b260b9a-vasanthmurugesan47-901a.e.aivencloud.com:25917/defaultdb?sslmode=require' });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export default prisma;
