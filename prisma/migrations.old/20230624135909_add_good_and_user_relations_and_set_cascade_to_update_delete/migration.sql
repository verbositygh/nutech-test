/*
  Warnings:

  - Added the required column `userId` to the `Good` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Good" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "buyingPrice" DECIMAL NOT NULL,
    "sellingPrice" DECIMAL NOT NULL,
    "stock" INTEGER NOT NULL,
    "image" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Good_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Good" ("buyingPrice", "id", "image", "name", "sellingPrice", "stock") SELECT "buyingPrice", "id", "image", "name", "sellingPrice", "stock" FROM "Good";
DROP TABLE "Good";
ALTER TABLE "new_Good" RENAME TO "Good";
CREATE UNIQUE INDEX "Good_name_key" ON "Good"("name");
CREATE TABLE "new_AuthToken" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "token" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "AuthToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_AuthToken" ("id", "token", "userId") SELECT "id", "token", "userId" FROM "AuthToken";
DROP TABLE "AuthToken";
ALTER TABLE "new_AuthToken" RENAME TO "AuthToken";
CREATE UNIQUE INDEX "AuthToken_token_key" ON "AuthToken"("token");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
