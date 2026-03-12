import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set in .env");
}

const adapter = new PrismaPg({
  connectionString: connectionString, // this line is important
});

/**
 * WHY this file exists:
 * - PrismaClient একবারই create করা উচিত
 * - বারবার new PrismaClient করলে DB connection leak হয়
 */

export const prisma = new PrismaClient({ adapter });

// optional: global caching for dev (প্রোডাকশনে careful থাকুন)
if (process.env.NODE_ENV !== "production") {
  // @ts-ignore
  global.prisma = prisma;
}

prisma
  .$connect()
  .then(() => {
    console.log("✅ Database connected successfully");
  })
  .catch((err) => {
    console.error("❌ Database connection failed", err);
  });

/**
 * This prisma object is reused everywhere
 * Example:
 *   prisma.owner.findUnique()
 *   prisma.shop.create()
 */
