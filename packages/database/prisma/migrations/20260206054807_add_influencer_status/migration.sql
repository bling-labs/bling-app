/*
  Warnings:

  - You are about to drop the column `registration_complete` on the `influencers` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "InfluencerStatus" AS ENUM ('draft', 'active', 'rejected', 'suspended', 'hidden');

-- AlterTable
ALTER TABLE "influencers" DROP COLUMN "registration_complete",
ADD COLUMN     "status" "InfluencerStatus" NOT NULL DEFAULT 'draft';
