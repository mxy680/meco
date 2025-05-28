/*
  Warnings:

  - You are about to drop the column `default` on the `Team` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Team" DROP COLUMN "default",
ADD COLUMN     "is_default" BOOLEAN NOT NULL DEFAULT true;
