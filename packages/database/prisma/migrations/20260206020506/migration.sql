-- AlterTable
ALTER TABLE "influencers" ADD COLUMN     "company" TEXT,
ADD COLUMN     "landline_phone" TEXT,
ADD COLUMN     "mobile_phone" TEXT,
ADD COLUMN     "referral_code" TEXT,
ADD COLUMN     "registration_complete" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "phone" DROP NOT NULL;
