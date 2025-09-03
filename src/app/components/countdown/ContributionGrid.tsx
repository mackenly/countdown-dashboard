"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";

interface ContributionData {
  date: string;
  count: number;
  level: number;
}

interface ContributionGridProps {
  data: ContributionData[];
  className?: string;
}

export function ContributionGrid({ data, className }: ContributionGridProps) {
  // Group data by weeks
  const weeks: ContributionData[][] = [];
  let currentWeek: ContributionData[] = [];
  
  data.forEach((day, index) => {
    const date = new Date(day.date);
    const dayOfWeek = date.getDay();
    
    // Start a new week on Sunday (0) or if it's the first day
    if (dayOfWeek === 0 || index === 0) {
      if (currentWeek.length > 0) {
        weeks.push(currentWeek);
      }
      currentWeek = [];
    }
    
    currentWeek.push(day);
  });
  
  if (currentWeek.length > 0) {
    weeks.push(currentWeek);
  }

  const getColorClass = (level: number) => {
    switch (level) {
      case 0: return "bg-slate-100 dark:bg-slate-800"; // No work
      case 1: return "bg-green-400"; // Work day
      case 2: return "bg-red-400"; // Holiday
      case 3: return "bg-blue-400"; // PTO day
      default: return "bg-slate-100 dark:bg-slate-800";
    }
  };

  const getTooltipText = (day: ContributionData) => {
    const date = new Date(day.date);
    const dateStr = date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
    
    switch (day.level) {
      case 0: return `${dateStr}: No work scheduled`;
      case 1: return `${dateStr}: Work day`;
      case 2: return `${dateStr}: Holiday`;
      case 3: return `${dateStr}: PTO day`;
      default: return dateStr;
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-center text-xl">📅 Work Schedule Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Legend */}
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-400 rounded"></div>
              <span>Work Day</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-400 rounded"></div>
              <span>Holiday</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-400 rounded"></div>
              <span>PTO Day</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-slate-100 dark:bg-slate-800 rounded"></div>
              <span>No Work</span>
            </div>
          </div>

          {/* Grid */}
          <div className="overflow-x-auto">
            <div className="flex gap-1 min-w-max">
              {weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-1">
                  {week.map((day, dayIndex) => (
                    <div
                      key={`${weekIndex}-${dayIndex}`}
                      className={`w-3 h-3 rounded-sm cursor-pointer hover:ring-2 hover:ring-slate-400 transition-all ${getColorClass(day.level)}`}
                      title={getTooltipText(day)}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Month labels */}
          <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400">
            <span>Less</span>
            <span>More</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
