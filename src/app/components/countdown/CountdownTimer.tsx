"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";

interface CountdownTimerProps {
  targetDate: Date;
  className?: string;
}

export function CountdownTimer({ targetDate, className }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    total: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const target = targetDate.getTime();
      const difference = target - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds, total: difference });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const isExpired = timeLeft.total <= 0;

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-center text-2xl">
          {isExpired ? "🎉 Target Date Reached!" : "⏰ Countdown Timer"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isExpired ? (
          <div className="text-center text-4xl font-bold text-green-600">
            Congratulations!
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-blue-600">
                {timeLeft.days}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                Days
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-green-600">
                {timeLeft.hours}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                Hours
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-yellow-600">
                {timeLeft.minutes}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                Minutes
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-red-600">
                {timeLeft.seconds}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                Seconds
              </div>
            </div>
          </div>
        )}
        <div className="mt-4 text-center text-sm text-slate-600 dark:text-slate-400">
          Target: {targetDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </div>
      </CardContent>
    </Card>
  );
}
