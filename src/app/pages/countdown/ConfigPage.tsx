"use client";

import { useState, useEffect } from "react";
import { RequestInfo } from "rwsdk/worker";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Calendar } from "@/app/components/ui/calendar";
import { DAY_NAMES } from "@/lib/countdown";

interface CountdownConfig {
  id?: string;
  targetDate: Date;
  workDays: number[];
  holidays: Date[];
  floatingHolidays: number;
  ptoDays: number;
}

export function ConfigPage({ ctx }: RequestInfo) {
  const [config, setConfig] = useState<CountdownConfig>({
    targetDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // Default to 1 year from now
    workDays: [1, 2, 3, 4, 5], // Monday-Friday
    holidays: [],
    floatingHolidays: 0,
    ptoDays: 0
  });
  
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  // Load existing config on mount
  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const response = await fetch('/api/countdown/config');
      if (response.ok) {
        const data: any = await response.json();
        if (data) {
          setConfig({
            targetDate: new Date(data.targetDate),
            workDays: data.workDays,
            holidays: data.holidays.map((d: string) => new Date(d)),
            floatingHolidays: data.floatingHolidays,
            ptoDays: data.ptoDays
          });
        }
      }
    } catch (error) {
      console.error('Failed to load config:', error);
    }
  };

  const saveConfig = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/countdown/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          targetDate: config.targetDate.toISOString(),
          workDays: config.workDays,
          holidays: config.holidays.map(d => d.toISOString()),
          floatingHolidays: config.floatingHolidays,
          ptoDays: config.ptoDays
        }),
      });

      if (response.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        console.error('Failed to save config');
      }
    } catch (error) {
      console.error('Failed to save config:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleWorkDay = (dayIndex: number) => {
    setConfig(prev => ({
      ...prev,
      workDays: prev.workDays.includes(dayIndex)
        ? prev.workDays.filter(d => d !== dayIndex)
        : [...prev.workDays, dayIndex].sort()
    }));
  };

  const addHoliday = (date: Date) => {
    const dateStr = date.toDateString();
    const exists = config.holidays.some(h => h.toDateString() === dateStr);
    
    if (!exists) {
      setConfig(prev => ({
        ...prev,
        holidays: [...prev.holidays, date].sort((a, b) => a.getTime() - b.getTime())
      }));
    }
  };

  const removeHoliday = (date: Date) => {
    setConfig(prev => ({
      ...prev,
      holidays: prev.holidays.filter(h => h.toDateString() !== date.toDateString())
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            Countdown Configuration
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Set up your work schedule and target date
          </p>
        </div>

        {/* Target Date */}
        <Card>
          <CardHeader>
            <CardTitle>🎯 Target Date</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              selectedDate={config.targetDate}
              onDateSelect={(date) => setConfig(prev => ({ ...prev, targetDate: date }))}
              minDate={new Date()}
              className="max-w-md mx-auto"
            />
          </CardContent>
        </Card>

        {/* Work Schedule */}
        <Card>
          <CardHeader>
            <CardTitle>📅 Work Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {DAY_NAMES.map((dayName, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`day-${index}`}
                    checked={config.workDays.includes(index)}
                    onChange={() => toggleWorkDay(index)}
                    className="rounded border-slate-300"
                  />
                  <Label htmlFor={`day-${index}`} className="text-sm">
                    {dayName}
                  </Label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Time Off */}
        <Card>
          <CardHeader>
            <CardTitle>🏖️ Time Off</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="floating-holidays">Floating Holidays</Label>
                <Input
                  id="floating-holidays"
                  type="number"
                  min="0"
                  value={config.floatingHolidays}
                  onChange={(e) => setConfig(prev => ({ 
                    ...prev, 
                    floatingHolidays: parseInt(e.target.value) || 0 
                  }))}
                />
              </div>
              <div>
                <Label htmlFor="pto-days">PTO Days</Label>
                <Input
                  id="pto-days"
                  type="number"
                  min="0"
                  value={config.ptoDays}
                  onChange={(e) => setConfig(prev => ({ 
                    ...prev, 
                    ptoDays: parseInt(e.target.value) || 0 
                  }))}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Holidays */}
        <Card>
          <CardHeader>
            <CardTitle>🎉 Holidays</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label>Add Holiday</Label>
                <Calendar
                  onDateSelect={addHoliday}
                  minDate={new Date()}
                  maxDate={config.targetDate}
                  className="max-w-md"
                />
              </div>
              
              {config.holidays.length > 0 && (
                <div>
                  <Label>Selected Holidays</Label>
                  <div className="mt-2 space-y-2">
                    {config.holidays.map((holiday, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-800 rounded">
                        <span>{holiday.toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeHoliday(holiday)}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="text-center">
          <Button
            onClick={saveConfig}
            disabled={loading}
            size="lg"
            className="min-w-32"
          >
            {loading ? "Saving..." : saved ? "Saved!" : "Save Configuration"}
          </Button>
        </div>

        {/* Navigation */}
        <div className="flex justify-center gap-4">
          <Button
            variant="outline"
            onClick={() => window.location.href = "/"}
          >
            View Dashboard
          </Button>
          <Button
            variant="outline"
            onClick={() => window.location.href = "/account"}
          >
            Back to Account
          </Button>
        </div>
      </div>
    </div>
  );
}
