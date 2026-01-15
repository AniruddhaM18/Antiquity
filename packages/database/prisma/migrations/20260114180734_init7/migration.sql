/*
  Warnings:

  - The values [HOST,PARTICIPANT] on the enum `ContestRole` will be removed. If these variants are still used in the database, this will fail.
  - The values [USER,ADMIN] on the enum `ROLE` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ContestRole_new" AS ENUM ('host', 'participant');
ALTER TABLE "ContestMember" ALTER COLUMN "role" TYPE "ContestRole_new" USING ("role"::text::"ContestRole_new");
ALTER TYPE "ContestRole" RENAME TO "ContestRole_old";
ALTER TYPE "ContestRole_new" RENAME TO "ContestRole";
DROP TYPE "public"."ContestRole_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "ROLE_new" AS ENUM ('user', 'admin');
ALTER TABLE "public"."User" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "role" TYPE "ROLE_new" USING ("role"::text::"ROLE_new");
ALTER TYPE "ROLE" RENAME TO "ROLE_old";
ALTER TYPE "ROLE_new" RENAME TO "ROLE";
DROP TYPE "public"."ROLE_old";
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'user';
COMMIT;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'user';
