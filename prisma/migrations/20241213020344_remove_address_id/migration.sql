/*
  Warnings:

  - The primary key for the `addresses` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `addresses` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "addresses" DROP CONSTRAINT "addresses_pkey",
DROP COLUMN "id";
