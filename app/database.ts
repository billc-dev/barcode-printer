import { PrismaClient } from "@prisma/client";

export const database = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});
