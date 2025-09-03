-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "CountdownConfig";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Countdown" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "targetDate" DATETIME NOT NULL,
    "workDays" TEXT NOT NULL DEFAULT '[1,2,3,4,5]',
    "holidays" TEXT NOT NULL DEFAULT '[]',
    "floatingHolidays" INTEGER NOT NULL DEFAULT 0,
    "ptoDays" INTEGER NOT NULL DEFAULT 0,
    "enabledWidgets" TEXT NOT NULL DEFAULT '["timer","progress","contribution","stats"]',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Countdown_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "Countdown_userId_idx" ON "Countdown"("userId");
