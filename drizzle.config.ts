import type { Config } from "drizzle-kit";
import { env } from "~/env";

export default {
  dialect: "postgresql",
  out: "./drizzle",
  schema: "./src/server/api/db/schema",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
} satisfies Config;
