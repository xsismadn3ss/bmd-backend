/*
  Warnings:

  - You are about to drop the column `date` on the `meetups` table. All the data in the column will be lost.
  - You are about to drop the column `endTime` on the `meetups` table. All the data in the column will be lost.
  - You are about to drop the column `startTime` on the `meetups` table. All the data in the column will be lost.
  - Added the required column `end_date_time` to the `meetups` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start_date_time` to the `meetups` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `meetups` DROP COLUMN `date`,
    DROP COLUMN `endTime`,
    DROP COLUMN `startTime`,
    ADD COLUMN `end_date_time` DATETIME(3) NOT NULL,
    ADD COLUMN `start_date_time` DATETIME(3) NOT NULL;
