/*
  Warnings:

  - You are about to drop the column `gender` on the `people` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_people" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "species" TEXT NOT NULL DEFAULT 'HUMAN',
    "dateOfBirth" DATETIME,
    "bloodType" TEXT,
    "breed" TEXT,
    "microchipId" TEXT,
    "weight" REAL,
    "weightUnit" TEXT DEFAULT 'lbs',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_people" ("bloodType", "breed", "createdAt", "dateOfBirth", "id", "microchipId", "name", "species", "updatedAt", "weight", "weightUnit") SELECT "bloodType", "breed", "createdAt", "dateOfBirth", "id", "microchipId", "name", "species", "updatedAt", "weight", "weightUnit" FROM "people";
DROP TABLE "people";
ALTER TABLE "new_people" RENAME TO "people";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
