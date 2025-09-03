"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { CountdownTimer } from "./CountdownTimer";
import { ProgressIndicator } from "./ProgressIndicator";
import { ContributionGrid } from "./ContributionGrid";

interface WidgetPreviewProps {
  widgetId: string;
  className?: string;
}

export function WidgetPreview({ widgetId, className }: WidgetPreviewProps) {
  // Dummy data for previews
  const dummyTargetDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days from now
  const dummyCountdownData = {
    totalDays: 30,
    remainingWorkDays: 22,
    percentageComplete: 26.7
  };
  const dummyContributionData = Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    count: Math.random() > 0.3 ? 1 : 0, // Random work days
    level: Math.random() > 0.3 ? 1 : 0
  }));

  const renderPreview = () => {
    switch (widgetId) {
      case 'timer':
        return (
          <div className="scale-75 origin-top">
            <CountdownTimer targetDate={dummyTargetDate} />
          </div>
        );
      case 'progress':
        return (
          <div className="scale-75 origin-top">
            <ProgressIndicator
              totalDays={dummyCountdownData.totalDays}
              remainingDays={dummyCountdownData.remainingWorkDays}
              percentageComplete={dummyCountdownData.percentageComplete}
            />
          </div>
        );
      case 'contribution':
        return (
          <div className="scale-75 origin-top">
            <ContributionGrid data={dummyContributionData} />
          </div>
        );
      case 'stats':
        return (
          <Card className="scale-75 origin-top">
            <CardHeader>
              <CardTitle className="text-center text-xl">📈 Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">22</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Total Work Days</div>
                </div>
                <div className="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">3</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Holidays</div>
                </div>
                <div className="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">2</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Floating Holidays</div>
                </div>
                <div className="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">5</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">PTO Days</div>
                </div>
              </div>
              
              <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 rounded-lg">
                <div className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  3 weeks, 1 day
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  until target date
                </div>
              </div>
            </CardContent>
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`border rounded-lg p-4 bg-slate-50 dark:bg-slate-800 ${className}`}>
      <div className="text-xs text-slate-500 dark:text-slate-400 mb-2">Preview:</div>
      {renderPreview()}
    </div>
  );
}
