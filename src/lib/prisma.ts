import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    // TODO: Add query logging during development if useful.
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

