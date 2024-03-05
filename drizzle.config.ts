import type { Config } from "drizzle-kit";
import { env } from "~/env";

export default {
  driver: "pg",
  out: "./drizzle",
  schema: "./src/server/api/db/schema.ts",
  dbCredentials: {
    connectionString: env.DATABASE_URL,
  },
} satisfies Config;
