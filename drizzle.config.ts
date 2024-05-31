import type { Config } from "drizzle-kit";

export default {
  out: "./database/migrations",
  schema: "./database/schema.ts",
  breakpoints: true,
  dbCredentials: {
    url: process.env.DATABASE_URL,
    authToken: process.env.DATABASE_AUTH_TOKEN,
  },
  driver: "turso",
} satisfies Config;
