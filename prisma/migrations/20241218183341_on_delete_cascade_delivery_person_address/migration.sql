-- DropForeignKey
ALTER TABLE "addresses" DROP CONSTRAINT "addresses_delivery_person_id_fkey";

-- AddForeignKey
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_delivery_person_id_fkey" FOREIGN KEY ("delivery_person_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
