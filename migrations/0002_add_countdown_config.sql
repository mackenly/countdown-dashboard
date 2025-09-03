-- CreateTable
CREATE TABLE "CountdownConfig" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "targetDate" DATETIME NOT NULL,
    "workDays" TEXT NOT NULL DEFAULT '[1,2,3,4,5]',
    "holidays" TEXT NOT NULL DEFAULT '[]',
    "floatingHolidays" INTEGER NOT NULL DEFAULT 0,
    "ptoDays" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "CountdownConfig_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "CountdownConfig_userId_key" ON "CountdownConfig"("userId");
