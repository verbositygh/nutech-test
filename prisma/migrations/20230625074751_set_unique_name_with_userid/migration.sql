/*
  Warnings:

  - A unique constraint covering the columns `[name,userId]` on the table `Good` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Good_name_key";

-- CreateIndex
CREATE UNIQUE INDEX "Good_name_userId_key" ON "Good"("name", "userId");
