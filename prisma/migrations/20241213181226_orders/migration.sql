-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('STORED', 'WAITING', 'PICKED_UP', 'DELIVERED');

-- CreateTable
CREATE TABLE "orders" (
    "id" TEXT NOT NULL,
    "recipient_id" TEXT NOT NULL,
    "delivery_person_id" TEXT,
    "status" "OrderStatus" NOT NULL,
    "storedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "postedAt" TIMESTAMP(3),
    "pickedUpAt" TIMESTAMP(3),
    "deliveredAt" TIMESTAMP(3),

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_delivery_person_id_fkey" FOREIGN KEY ("delivery_person_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_recipient_id_fkey" FOREIGN KEY ("recipient_id") REFERENCES "recipients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
