"use client";

import { useState, useEffect } from "react";
import { RequestInfo } from "rwsdk/worker";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Calendar } from "@/app/components/ui/calendar";
import { WidgetPreview } from "@/app/components/countdown/WidgetPreview";
import { DAY_NAMES, WIDGET_TYPES } from "@/lib/countdown";

interface CountdownForm {
  name: string;
  description: string;
  targetDate: Date;
  workDays: number[];
  holidays: Date[];
  floatingHolidays: number;
  ptoDays: number;
  enabledWidgets: string[];
}

export function CreatePage({ ctx }: RequestInfo) {
  const [form, setForm] = useState<CountdownForm>({
    name: "",
    description: "",
    targetDate: new Date(), // Default to today
    workDays: [1, 2, 3, 4, 5], // Monday-Friday
    holidays: [],
    floatingHolidays: 0,
    ptoDays: 0,
    enabledWidgets: ["timer", "progress", "contribution", "stats"]
  });
  
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const toggleWorkDay = (dayIndex: number) => {
    setForm(prev => ({
      ...prev,
      workDays: prev.workDays.includes(dayIndex)
        ? prev.workDays.filter(d => d !== dayIndex)
        : [...prev.workDays, dayIndex].sort()
    }));
  };

  const addHoliday = (date: Date) => {
    const dateStr = date.toDateString();
    const exists = form.holidays.some(h => h.toDateString() === dateStr);
    
    if (!exists) {
      setForm(prev => ({
        ...prev,
        holidays: [...prev.holidays, date].sort((a, b) => a.getTime() - b.getTime())
      }));
    }
  };

  const removeHoliday = (date: Date) => {
    setForm(prev => ({
      ...prev,
      holidays: prev.holidays.filter(h => h.toDateString() !== date.toDateString())
    }));
  };

  const toggleWidget = (widgetId: string) => {
    setForm(prev => ({
      ...prev,
      enabledWidgets: prev.enabledWidgets.includes(widgetId)
        ? prev.enabledWidgets.filter(w => w !== widgetId)
        : [...prev.enabledWidgets, widgetId]
    }));
  };

  const saveCountdown = async () => {
    if (!form.name.trim()) {
      alert('Please enter a name for your countdown');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/countdowns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          targetDate: form.targetDate.toISOString(),
          workDays: form.workDays,
          holidays: form.holidays.map(d => d.toISOString()),
          floatingHolidays: form.floatingHolidays,
          ptoDays: form.ptoDays,
          enabledWidgets: form.enabledWidgets
        }),
      });

      if (response.ok) {
        setSaved(true);
        setTimeout(() => {
          window.location.href = '/manage';
        }, 2000);
      } else {
        console.error('Failed to save countdown');
        alert('Failed to save countdown. Please try again.');
      }
    } catch (error) {
      console.error('Failed to save countdown:', error);
      alert('Failed to save countdown. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            Create New Countdown
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Set up your countdown configuration
          </p>
        </div>

        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>📝 Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Countdown Name *</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Retirement Countdown, Project Deadline"
              />
            </div>
            <div>
              <Label htmlFor="description">Description (Optional)</Label>
              <Input
                id="description"
                value={form.description}
                onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Brief description of what this countdown is for"
              />
            </div>
          </CardContent>
        </Card>

        {/* Target Date */}
        <Card>
          <CardHeader>
            <CardTitle>🎯 Target Date</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              selectedDate={form.targetDate}
              onDateSelect={(date) => setForm(prev => ({ ...prev, targetDate: date }))}
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
            <div>
              <Label>Select your work days</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day, index) => (
                  <Button
                    key={index}
                    variant={form.workDays.includes(index) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleWorkDay(index)}
                  >
                    {day.slice(0, 3)}
                  </Button>
                ))}
              </div>
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
                  value={form.floatingHolidays}
                  onChange={(e) => setForm(prev => ({ 
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
                  value={form.ptoDays}
                  onChange={(e) => setForm(prev => ({ 
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
                  maxDate={form.targetDate}
                  className="max-w-md"
                />
              </div>
              
              {form.holidays.length > 0 && (
                <div>
                  <Label>Selected Holidays</Label>
                  <div className="mt-2 space-y-2">
                    {form.holidays.map((holiday, index) => (
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

        {/* Widget Selection */}
        <Card>
          <CardHeader>
            <CardTitle>🎨 Dashboard Widgets</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
              Choose which widgets to display on your countdown dashboard
            </p>
            <div className="space-y-6">
              {Object.entries(WIDGET_TYPES).map(([widgetId, widget]) => (
                <div key={widgetId} className="border rounded-lg p-4">
                  <div className="flex items-start space-x-3 mb-4">
                    <input
                      type="checkbox"
                      id={`widget-${widgetId}`}
                      checked={form.enabledWidgets.includes(widgetId)}
                      onChange={() => toggleWidget(widgetId)}
                      className="rounded border-slate-300 mt-1"
                    />
                    <div className="flex-1">
                      <Label htmlFor={`widget-${widgetId}`} className="flex items-center gap-2 cursor-pointer">
                        <span className="text-lg">{widget.icon}</span>
                        <div>
                          <div className="font-medium">{widget.name}</div>
                          <div className="text-sm text-slate-600 dark:text-slate-400">
                            {widget.description}
                          </div>
                        </div>
                      </Label>
                    </div>
                  </div>
                  
                  {/* Widget Preview */}
                  <WidgetPreview widgetId={widgetId} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="text-center">
          <Button
            onClick={saveCountdown}
            disabled={loading || !form.name.trim()}
            size="lg"
            className="min-w-32"
          >
            {loading ? "Creating..." : saved ? "Created!" : "Create Countdown"}
          </Button>
        </div>

        {/* Navigation */}
        <div className="flex justify-center gap-4">
          <Button
            variant="outline"
            onClick={() => window.location.href = "/manage"}
          >
            Back to Manage
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
