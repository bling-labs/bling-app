-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('guest', 'influencer', 'advertiser');

-- CreateTable
CREATE TABLE "profiles" (
    "id" UUID NOT NULL,
    "email" TEXT,
    "user_type" "UserType" NOT NULL DEFAULT 'guest',
    "is_onboarded" BOOLEAN NOT NULL DEFAULT false,
    "agreed_terms_at" TIMESTAMPTZ,
    "full_name" TEXT,
    "phone" TEXT,
    "avatar_url" TEXT,
    "nickname" TEXT,
    "gender" TEXT,
    "birth_date" DATE,
    "categories" TEXT[],
    "bio" TEXT,
    "company_name" TEXT,
    "company_url" TEXT,
    "business_category" TEXT,
    "job_title" TEXT,
    "business_license_url" TEXT,
    "company_description" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sns_channels" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "profile_id" UUID NOT NULL,
    "platform" TEXT NOT NULL,
    "channel_url" TEXT NOT NULL,
    "follower_count" INTEGER,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sns_channels_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "sns_channels" ADD CONSTRAINT "sns_channels_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
