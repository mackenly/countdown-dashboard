import { db } from "@/db";
import { parseWorkDays, parseHolidays, parseEnabledWidgets } from "@/lib/countdown";

// Get all countdowns for a user
export async function getCountdowns(userId: string) {
  const countdowns = await db.countdown.findMany({
    where: { userId, isActive: true },
    orderBy: { createdAt: 'desc' }
  });
  
  return countdowns.map(countdown => ({
    ...countdown,
    workDays: parseWorkDays(countdown.workDays),
    holidays: parseHolidays(countdown.holidays),
    enabledWidgets: parseEnabledWidgets(countdown.enabledWidgets)
  }));
}

// Get a specific countdown by ID
export async function getCountdown(countdownId: string, userId: string) {
  const countdown = await db.countdown.findFirst({
    where: { id: countdownId, userId, isActive: true }
  });
  
  if (!countdown) {
    return null;
  }
  
  return {
    ...countdown,
    workDays: parseWorkDays(countdown.workDays),
    holidays: parseHolidays(countdown.holidays),
    enabledWidgets: parseEnabledWidgets(countdown.enabledWidgets)
  };
}

// Create a new countdown
export async function createCountdown(
  userId: string,
  data: {
    name: string;
    description?: string;
    targetDate: Date;
    workDays: number[];
    holidays: Date[];
    floatingHolidays: number;
    ptoDays: number;
    enabledWidgets: string[];
  }
) {
  return await db.countdown.create({
    data: {
      userId,
      name: data.name,
      description: data.description,
      targetDate: data.targetDate,
      workDays: JSON.stringify(data.workDays),
      holidays: JSON.stringify(data.holidays.map(d => d.toISOString())),
      floatingHolidays: data.floatingHolidays,
      ptoDays: data.ptoDays,
      enabledWidgets: JSON.stringify(data.enabledWidgets)
    }
  });
}

// Update an existing countdown
export async function updateCountdown(
  countdownId: string,
  userId: string,
  data: {
    name?: string;
    description?: string;
    targetDate?: Date;
    workDays?: number[];
    holidays?: Date[];
    floatingHolidays?: number;
    ptoDays?: number;
    enabledWidgets?: string[];
  }
) {
  const updateData: any = {};
  
  if (data.name) updateData.name = data.name;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.targetDate) updateData.targetDate = data.targetDate;
  if (data.workDays) updateData.workDays = JSON.stringify(data.workDays);
  if (data.holidays) updateData.holidays = JSON.stringify(data.holidays.map(d => d.toISOString()));
  if (data.floatingHolidays !== undefined) updateData.floatingHolidays = data.floatingHolidays;
  if (data.ptoDays !== undefined) updateData.ptoDays = data.ptoDays;
  if (data.enabledWidgets) updateData.enabledWidgets = JSON.stringify(data.enabledWidgets);
  
  return await db.countdown.update({
    where: { id: countdownId },
    data: updateData
  });
}

// Delete a countdown (soft delete by setting isActive to false)
export async function deleteCountdown(countdownId: string, userId: string) {
  return await db.countdown.update({
    where: { id: countdownId },
    data: { isActive: false }
  });
}

// Legacy functions for backward compatibility
export async function getCountdownConfig(userId: string) {
  const countdowns = await getCountdowns(userId);
  return countdowns[0] || null; // Return first countdown for backward compatibility
}

export async function createCountdownConfig(
  userId: string,
  data: {
    targetDate: Date;
    workDays: number[];
    holidays: Date[];
    floatingHolidays: number;
    ptoDays: number;
  }
) {
  return await createCountdown(userId, {
    name: "My Countdown",
    targetDate: data.targetDate,
    workDays: data.workDays,
    holidays: data.holidays,
    floatingHolidays: data.floatingHolidays,
    ptoDays: data.ptoDays,
    enabledWidgets: ["timer", "progress", "contribution", "stats"]
  });
}

export async function updateCountdownConfig(
  userId: string,
  data: {
    targetDate?: Date;
    workDays?: number[];
    holidays?: Date[];
    floatingHolidays?: number;
    ptoDays?: number;
  }
) {
  const countdowns = await getCountdowns(userId);
  if (countdowns.length === 0) {
    throw new Error("No countdown found");
  }
  
  return await updateCountdown(countdowns[0].id, userId, data);
}

export async function deleteCountdownConfig(userId: string) {
  const countdowns = await getCountdowns(userId);
  if (countdowns.length === 0) {
    throw new Error("No countdown found");
  }
  
  return await deleteCountdown(countdowns[0].id, userId);
}
