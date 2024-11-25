/*
  Warnings:

  - Added the required column `accessToken` to the `OAuthProvider` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "OAuthProvider" ADD COLUMN     "accessToken" TEXT NOT NULL,
ADD COLUMN     "refreshToken" TEXT;
