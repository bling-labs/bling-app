/*
  Warnings:

  - The values [pending] on the enum `InfluencerStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "InfluencerStatus_new" AS ENUM ('draft', 'applied', 'reviewing', 'active', 'rejected', 'suspended', 'hidden');
ALTER TABLE "public"."influencers" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "influencers" ALTER COLUMN "status" TYPE "InfluencerStatus_new" USING ("status"::text::"InfluencerStatus_new");
ALTER TYPE "InfluencerStatus" RENAME TO "InfluencerStatus_old";
ALTER TYPE "InfluencerStatus_new" RENAME TO "InfluencerStatus";
DROP TYPE "public"."InfluencerStatus_old";
ALTER TABLE "influencers" ALTER COLUMN "status" SET DEFAULT 'draft';
COMMIT;
