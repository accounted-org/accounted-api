/*
  Warnings:

  - You are about to drop the `Auth` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SecurityEvent` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Space` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SpaceMember` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Transaction` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Auth" DROP CONSTRAINT "Auth_userId_fkey";

-- DropForeignKey
ALTER TABLE "SecurityEvent" DROP CONSTRAINT "SecurityEvent_userId_fkey";

-- DropForeignKey
ALTER TABLE "Space" DROP CONSTRAINT "Space_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "SpaceMember" DROP CONSTRAINT "SpaceMember_memberId_fkey";

-- DropForeignKey
ALTER TABLE "SpaceMember" DROP CONSTRAINT "SpaceMember_spaceId_fkey";

-- DropTable
DROP TABLE "Auth";

-- DropTable
DROP TABLE "SecurityEvent";

-- DropTable
DROP TABLE "Space";

-- DropTable
DROP TABLE "SpaceMember";

-- DropTable
DROP TABLE "Transaction";

-- DropTable
DROP TABLE "User";
