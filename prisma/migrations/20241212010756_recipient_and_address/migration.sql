-- CreateTable
CREATE TABLE "recipients" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "recipients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "addresses" (
    "id" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "complement" TEXT,
    "neighborhood" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zipcode" TEXT NOT NULL,
    "recipient_id" TEXT NOT NULL,

    CONSTRAINT "addresses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "addresses_recipient_id_key" ON "addresses"("recipient_id");

-- AddForeignKey
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_recipient_id_fkey" FOREIGN KEY ("recipient_id") REFERENCES "recipients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
