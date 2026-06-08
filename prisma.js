import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

let connectionString = process.env.DATABASE_URL || 'postgres://avnadmin:AVNS_j4I4YYXnAq285V_-SI4@pg-1b260b9a-vasanthmurugesan47-901a.e.aivencloud.com:25917/defaultdb?sslmode=no-verify';
if (!connectionString.includes('sslmode=')) connectionString += '&sslmode=no-verify';
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export default prisma;
