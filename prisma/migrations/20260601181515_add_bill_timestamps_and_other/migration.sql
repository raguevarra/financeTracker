/*
  Warnings:

  - You are about to drop the column `visibility` on the `Bill` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `Bill` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Bill_visibility_idx";

-- AlterTable
ALTER TABLE "Bill" DROP COLUMN "visibility",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
