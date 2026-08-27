import "dotenv/config";
import { defineConfig } from "prisma/config";

const provider = process.env["DB_PROVIDER"] || "postgresql";
const schemaPath = provider === "mysql" ? "prisma/schema.mysql.prisma" : "prisma/schema.prisma";

export default defineConfig({
  schema: schemaPath,
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env["DATABASE_URL"],
  },
});
