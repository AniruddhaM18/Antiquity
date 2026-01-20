/*
  Warnings:

  - A unique constraint covering the columns `[joinCode]` on the table `Contest` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `joinCode` to the `Contest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Contest" ADD COLUMN     "joinCode" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Contest_joinCode_key" ON "Contest"("joinCode");
