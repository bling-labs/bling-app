/*
  Warnings:

  - You are about to drop the column `profile_id` on the `sns_channels` table. All the data in the column will be lost.
  - You are about to drop the `profiles` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `influencer_id` to the `sns_channels` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('male', 'female', 'other');

-- AlterEnum
ALTER TYPE "UserType" ADD VALUE 'admin';

-- DropForeignKey
ALTER TABLE "sns_channels" DROP CONSTRAINT "sns_channels_profile_id_fkey";

-- AlterTable
ALTER TABLE "sns_channels" DROP COLUMN "profile_id",
ADD COLUMN     "influencer_id" UUID NOT NULL;

-- DropTable
DROP TABLE "profiles";

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "email" TEXT,
    "user_type" "UserType" NOT NULL DEFAULT 'guest',
    "is_onboarded" BOOLEAN NOT NULL DEFAULT false,
    "agreed_terms_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "influencers" (
    "id" UUID NOT NULL,
    "full_name" TEXT NOT NULL,
    "nickname" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "gender" "Gender" NOT NULL,
    "birth_date" DATE NOT NULL,
    "avatar_url" TEXT,
    "bio" TEXT,
    "categories" TEXT[],
    "tier_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "influencers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "influencer_tiers" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "description" TEXT,
    "settlement_rate" DECIMAL(5,4) NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "influencer_tiers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tier_benefits" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tier_id" UUID NOT NULL,
    "benefit_type" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tier_benefits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "advertisers" (
    "id" UUID NOT NULL,
    "company_name" TEXT NOT NULL,
    "business_category" TEXT NOT NULL,
    "company_url" TEXT,
    "company_description" TEXT,
    "business_license_url" TEXT,
    "contact_name" TEXT NOT NULL,
    "contact_phone" TEXT NOT NULL,
    "job_title" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "advertisers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "influencer_tiers_name_key" ON "influencer_tiers"("name");

-- CreateIndex
CREATE UNIQUE INDEX "influencer_tiers_level_key" ON "influencer_tiers"("level");

-- CreateIndex
CREATE UNIQUE INDEX "tier_benefits_tier_id_benefit_type_key" ON "tier_benefits"("tier_id", "benefit_type");

-- AddForeignKey
ALTER TABLE "influencers" ADD CONSTRAINT "influencers_id_fkey" FOREIGN KEY ("id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "influencers" ADD CONSTRAINT "influencers_tier_id_fkey" FOREIGN KEY ("tier_id") REFERENCES "influencer_tiers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tier_benefits" ADD CONSTRAINT "tier_benefits_tier_id_fkey" FOREIGN KEY ("tier_id") REFERENCES "influencer_tiers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sns_channels" ADD CONSTRAINT "sns_channels_influencer_id_fkey" FOREIGN KEY ("influencer_id") REFERENCES "influencers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "advertisers" ADD CONSTRAINT "advertisers_id_fkey" FOREIGN KEY ("id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
