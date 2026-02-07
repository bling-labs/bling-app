-- AlterEnum
ALTER TYPE "InfluencerStatus" ADD VALUE 'pending';

-- AlterTable
ALTER TABLE "sns_channels" ADD COLUMN     "is_profile_visible" BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE "invite_codes" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "code" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'multi',
    "used_count" INTEGER NOT NULL DEFAULT 0,
    "max_uses" INTEGER,
    "expires_at" TIMESTAMPTZ,
    "created_by" UUID,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "invite_codes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "invite_codes_code_key" ON "invite_codes"("code");
