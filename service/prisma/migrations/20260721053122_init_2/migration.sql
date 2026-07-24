/*
  Warnings:

  - A unique constraint covering the columns `[host,port,database,user]` on the table `Database` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Database_host_port_database_user_key" ON "Database"("host", "port", "database", "user");
