/*
  Warnings:

  - Added the required column `objectKey` to the `Database` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Database` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Database" ADD COLUMN     "objectKey" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Database_userId_idx" ON "Database"("userId");
