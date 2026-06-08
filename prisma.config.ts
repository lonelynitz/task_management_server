import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env.DATABASE_URL || "postgres://avnadmin:AVNS_j4I4YYXnAq285V_-SI4@pg-1b260b9a-vasanthmurugesan47-901a.e.aivencloud.com:25917/defaultdb?sslmode=require",
  },
});
