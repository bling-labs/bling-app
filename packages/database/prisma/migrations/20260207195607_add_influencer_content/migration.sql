-- CreateEnum
CREATE TYPE "ContentType" AS ENUM ('video', 'image');

-- CreateEnum
CREATE TYPE "ContentStatus" AS ENUM ('draft', 'visible');

-- CreateTable
CREATE TABLE "influencer_contents" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "influencer_id" UUID NOT NULL,
    "type" "ContentType" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "thumbnail_url" TEXT NOT NULL,
    "video_url" TEXT,
    "platform" TEXT NOT NULL,
    "status" "ContentStatus" NOT NULL DEFAULT 'draft',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "influencer_contents_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "influencer_contents" ADD CONSTRAINT "influencer_contents_influencer_id_fkey" FOREIGN KEY ("influencer_id") REFERENCES "influencers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
