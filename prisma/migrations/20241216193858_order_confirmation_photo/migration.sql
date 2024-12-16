-- CreateTable
CREATE TABLE "order_confirmation_photos" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "order_id" TEXT,

    CONSTRAINT "order_confirmation_photos_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "order_confirmation_photos" ADD CONSTRAINT "order_confirmation_photos_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;
