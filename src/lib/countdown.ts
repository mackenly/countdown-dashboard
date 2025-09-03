export interface Countdown {
  id: string;
  userId: string;
  name: string;
  description?: string;
  targetDate: Date;
  workDays: number[]; // 0=Sunday, 1=Monday, etc.
  holidays: Date[];
  floatingHolidays: number;
  ptoDays: number;
  enabledWidgets: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CountdownConfig {
  id: string;
  userId: string;
  targetDate: Date;
  workDays: number[]; // 0=Sunday, 1=Monday, etc.
  holidays: Date[];
  floatingHolidays: number;
  ptoDays: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CountdownData {
  totalDays: number;
  workDays: number;
  holidays: number;
  ptoDays: number;
  floatingHolidays: number;
  remainingWorkDays: number;
  percentageComplete: number;
  daysUntilTarget: number;
  weeksUntilTarget: number;
  monthsUntilTarget: number;
}

export interface WorkDayData {
  date: Date;
  isWorkDay: boolean;
  isHoliday: boolean;
  isPtoDay: boolean;
  isFloatingHoliday: boolean;
  dayOfWeek: number;
  dayName: string;
}

/**
 * Calculate work days between two dates, excluding weekends, holidays, and PTO
 */
export function calculateWorkDays(
  startDate: Date,
  endDate: Date,
  workDays: number[] = [1, 2, 3, 4, 5], // Default: Monday-Friday
  holidays: Date[] = [],
  ptoDays: Date[] = [],
  floatingHolidays: number = 0
): CountdownData {
  const now = new Date();
  const start = new Date(Math.max(startDate.getTime(), now.getTime()));
  const end = new Date(endDate);
  
  // Ensure we're working with dates at midnight
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);
  
  const totalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  
  let workDayCount = 0;
  let holidayCount = 0;
  let ptoCount = 0;
  let floatingHolidayCount = 0;
  
  const currentDate = new Date(start);
  const workDayData: WorkDayData[] = [];
  
  // Convert holidays and PTO days to date strings for comparison
  const holidayStrings = holidays.map(h => h.toDateString());
  const ptoStrings = ptoDays.map(p => p.toDateString());
  
  while (currentDate <= end) {
    const dayOfWeek = currentDate.getDay();
    const isWorkDay = workDays.includes(dayOfWeek);
    const isHoliday = holidayStrings.includes(currentDate.toDateString());
    const isPtoDay = ptoStrings.includes(currentDate.toDateString());
    
    let isFloatingHoliday = false;
    if (isWorkDay && !isHoliday && !isPtoDay && floatingHolidayCount < floatingHolidays) {
      isFloatingHoliday = true;
      floatingHolidayCount++;
    }
    
    if (isWorkDay) {
      workDayCount++;
      if (isHoliday) holidayCount++;
      if (isPtoDay) ptoCount++;
    }
    
    workDayData.push({
      date: new Date(currentDate),
      isWorkDay,
      isHoliday,
      isPtoDay,
      isFloatingHoliday,
      dayOfWeek,
      dayName: currentDate.toLocaleDateString('en-US', { weekday: 'long' })
    });
    
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  const remainingWorkDays = workDayCount - holidayCount - ptoCount - floatingHolidayCount;
  const percentageComplete = totalDays > 0 ? ((totalDays - remainingWorkDays) / totalDays) * 100 : 0;
  
  const daysUntilTarget = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  const weeksUntilTarget = Math.ceil(daysUntilTarget / 7);
  const monthsUntilTarget = Math.ceil(daysUntilTarget / 30);
  
  return {
    totalDays,
    workDays: workDayCount,
    holidays: holidayCount,
    ptoDays: ptoCount,
    floatingHolidays: floatingHolidayCount,
    remainingWorkDays,
    percentageComplete,
    daysUntilTarget,
    weeksUntilTarget,
    monthsUntilTarget
  };
}

/**
 * Generate a GitHub-style contribution grid data
 */
export function generateContributionData(
  startDate: Date,
  endDate: Date,
  workDays: number[] = [1, 2, 3, 4, 5],
  holidays: Date[] = [],
  ptoDays: Date[] = []
): { date: string; count: number; level: number }[] {
  const data: { date: string; count: number; level: number }[] = [];
  const currentDate = new Date(startDate);
  
  // Convert to date strings for comparison
  const holidayStrings = holidays.map(h => h.toDateString());
  const ptoStrings = ptoDays.map(p => p.toDateString());
  
  while (currentDate <= endDate) {
    const dayOfWeek = currentDate.getDay();
    const isWorkDay = workDays.includes(dayOfWeek);
    const isHoliday = holidayStrings.includes(currentDate.toDateString());
    const isPtoDay = ptoStrings.includes(currentDate.toDateString());
    
    let count = 0;
    let level = 0;
    
    if (isWorkDay && !isHoliday && !isPtoDay) {
      count = 1;
      level = 1; // Work day
    } else if (isHoliday) {
      count = 0;
      level = 2; // Holiday
    } else if (isPtoDay) {
      count = 0;
      level = 3; // PTO day
    }
    
    data.push({
      date: currentDate.toISOString().split('T')[0],
      count,
      level
    });
    
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return data;
}

/**
 * Format date for display
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * Format time remaining
 */
export function formatTimeRemaining(days: number): string {
  if (days <= 0) return "Target date reached!";
  
  const years = Math.floor(days / 365);
  const months = Math.floor((days % 365) / 30);
  const weeks = Math.floor((days % 30) / 7);
  const remainingDays = days % 7;
  
  const parts: string[] = [];
  if (years > 0) parts.push(`${years} year${years > 1 ? 's' : ''}`);
  if (months > 0) parts.push(`${months} month${months > 1 ? 's' : ''}`);
  if (weeks > 0) parts.push(`${weeks} week${weeks > 1 ? 's' : ''}`);
  if (remainingDays > 0) parts.push(`${remainingDays} day${remainingDays > 1 ? 's' : ''}`);
  
  return parts.join(', ');
}

/**
 * Get day names for work schedule
 */
export const DAY_NAMES = [
  'Sunday',
  'Monday', 
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
];

/**
 * Parse work days from JSON string
 */
export function parseWorkDays(workDaysJson: string): number[] {
  try {
    return JSON.parse(workDaysJson);
  } catch {
    return [1, 2, 3, 4, 5]; // Default to Monday-Friday
  }
}

/**
 * Parse holidays from JSON string
 */
export function parseHolidays(holidaysJson: string): Date[] {
  try {
    const dates = JSON.parse(holidaysJson);
    return dates.map((dateStr: string) => new Date(dateStr));
  } catch {
    return [];
  }
}

/**
 * Parse enabled widgets from JSON string
 */
export function parseEnabledWidgets(widgetsJson: string): string[] {
  try {
    return JSON.parse(widgetsJson);
  } catch {
    return ["timer", "progress", "contribution", "stats"]; // Default widgets
  }
}

/**
 * Available widget types
 */
export const WIDGET_TYPES = {
  timer: {
    id: "timer",
    name: "Countdown Timer",
    description: "Real-time countdown showing days, hours, minutes, and seconds",
    icon: "⏰"
  },
  progress: {
    id: "progress", 
    name: "Progress Indicator",
    description: "Progress bar and percentage completion",
    icon: "📊"
  },
  contribution: {
    id: "contribution",
    name: "Work Schedule Grid", 
    description: "GitHub-style contribution grid showing work days",
    icon: "📅"
  },
  stats: {
    id: "stats",
    name: "Quick Stats",
    description: "Summary statistics and time breakdown",
    icon: "📈"
  }
} as const;

export type WidgetType = keyof typeof WIDGET_TYPES;
