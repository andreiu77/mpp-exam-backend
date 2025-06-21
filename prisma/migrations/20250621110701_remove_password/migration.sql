/*
  Warnings:

  - The primary key for the `Voter` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `password` on the `Voter` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Voter" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "voted" INTEGER
);
INSERT INTO "new_Voter" ("id", "voted") SELECT "id", "voted" FROM "Voter";
DROP TABLE "Voter";
ALTER TABLE "new_Voter" RENAME TO "Voter";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
