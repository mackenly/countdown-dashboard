"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";

interface ProgressIndicatorProps {
  totalDays: number;
  remainingDays: number;
  percentageComplete: number;
  className?: string;
}

export function ProgressIndicator({ 
  totalDays, 
  remainingDays, 
  percentageComplete, 
  className 
}: ProgressIndicatorProps) {
  const progressColor = percentageComplete >= 75 
    ? "bg-green-500" 
    : percentageComplete >= 50 
    ? "bg-yellow-500" 
    : "bg-blue-500";

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-center text-xl">📊 Progress Overview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-600 dark:text-slate-400">Progress</span>
            <span className="font-semibold">{percentageComplete.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3">
            <div 
              className={`h-3 rounded-full transition-all duration-500 ${progressColor}`}
              style={{ width: `${Math.min(percentageComplete, 100)}%` }}
            />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{totalDays}</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Total Days</div>
          </div>
          <div className="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{remainingDays}</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Remaining</div>
          </div>
        </div>

        {/* Time Breakdown */}
        <div className="space-y-2">
          <h4 className="font-semibold text-slate-900 dark:text-slate-100">Time Breakdown</h4>
          <div className="grid grid-cols-1 gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-600 dark:text-slate-400">Days until target:</span>
              <span className="font-medium">{Math.ceil(remainingDays)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600 dark:text-slate-400">Weeks until target:</span>
              <span className="font-medium">{Math.ceil(remainingDays / 7)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600 dark:text-slate-400">Months until target:</span>
              <span className="font-medium">{Math.ceil(remainingDays / 30)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
