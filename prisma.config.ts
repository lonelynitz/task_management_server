import { defineConfig } from "prisma/config";

const dbUrl = process.env.DATABASE_URL || "";
const finalUrl = dbUrl && !dbUrl.includes('sslmode=') ? dbUrl + '&sslmode=no-verify' : dbUrl;

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: finalUrl,
  },
});
