/*
  Warnings:

  - You are about to drop the column `provider` on the `account` table. All the data in the column will be lost.
  - You are about to drop the column `providerAccountId` on the `account` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[providerId,accountId]` on the table `account` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "LiveContest" DROP CONSTRAINT "LiveContest_contestId_fkey";

-- DropForeignKey
ALTER TABLE "LiveResponse" DROP CONSTRAINT "LiveResponse_liveContestId_fkey";

-- DropForeignKey
ALTER TABLE "Question" DROP CONSTRAINT "Question_contestId_fkey";

-- DropIndex
DROP INDEX "account_provider_providerAccountId_key";

-- AlterTable
ALTER TABLE "LiveContest" ALTER COLUMN "endedAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "account" DROP COLUMN "provider",
DROP COLUMN "providerAccountId";

-- CreateIndex
CREATE UNIQUE INDEX "account_providerId_accountId_key" ON "account"("providerId", "accountId");

-- AddForeignKey
ALTER TABLE "LiveContest" ADD CONSTRAINT "LiveContest_contestId_fkey" FOREIGN KEY ("contestId") REFERENCES "Contest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_contestId_fkey" FOREIGN KEY ("contestId") REFERENCES "Contest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LiveResponse" ADD CONSTRAINT "LiveResponse_liveContestId_fkey" FOREIGN KEY ("liveContestId") REFERENCES "LiveContest"("id") ON DELETE CASCADE ON UPDATE CASCADE;
