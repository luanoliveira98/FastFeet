/*
  Warnings:

  - A unique constraint covering the columns `[delivery_person_id]` on the table `addresses` will be added. If there are existing duplicate values, this will fail.
  - The required column `id` was added to the `addresses` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "addresses" ADD COLUMN     "delivery_person_id" TEXT,
ADD COLUMN     "id" TEXT NOT NULL,
ALTER COLUMN "recipient_id" DROP NOT NULL,
ADD CONSTRAINT "addresses_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "addresses_delivery_person_id_key" ON "addresses"("delivery_person_id");

-- AddForeignKey
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_delivery_person_id_fkey" FOREIGN KEY ("delivery_person_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
