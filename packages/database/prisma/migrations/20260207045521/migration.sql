-- AlterTable
ALTER TABLE "advertisers" ADD COLUMN     "mobile_phone" TEXT,
ALTER COLUMN "contact_phone" DROP NOT NULL;
