/*
  Warnings:

  - You are about to drop the column `accountId` on the `Bill` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Bill` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Bill` table. All the data in the column will be lost.
  - Added the required column `userId` to the `Bill` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "BillVisibility" AS ENUM ('PERSONAL', 'HOUSEHOLD');

-- DropForeignKey
ALTER TABLE "Bill" DROP CONSTRAINT "Bill_accountId_fkey";

-- DropIndex
DROP INDEX "Bill_accountId_idx";

-- AlterTable
ALTER TABLE "Bill" DROP COLUMN "accountId",
DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "userId" TEXT NOT NULL,
ADD COLUMN     "visibility" "BillVisibility" NOT NULL DEFAULT 'PERSONAL';

-- CreateIndex
CREATE INDEX "Bill_userId_idx" ON "Bill"("userId");

-- CreateIndex
CREATE INDEX "Bill_visibility_idx" ON "Bill"("visibility");

-- CreateIndex
CREATE INDEX "Bill_userId_dueDate_idx" ON "Bill"("userId", "dueDate");

-- CreateIndex
CREATE INDEX "Bill_userId_isPaid_idx" ON "Bill"("userId", "isPaid");

-- AddForeignKey
ALTER TABLE "Bill" ADD CONSTRAINT "Bill_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
