"use client";

import { useState, useEffect } from "react";
import { RequestInfo } from "rwsdk/worker";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Calendar } from "@/app/components/ui/calendar";
import { WidgetPreview } from "@/app/components/countdown/WidgetPreview";
import { WIDGET_TYPES } from "@/lib/countdown";

interface Countdown {
  id: string;
  name: string;
  description?: string;
  targetDate: Date;
  workDays: number[];
  holidays: Date[];
  floatingHolidays: number;
  ptoDays: number;
  enabledWidgets: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export function EditPage({ ctx }: RequestInfo) {
  const [countdown, setCountdown] = useState<Countdown | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: '',
    description: '',
    targetDate: new Date(),
    workDays: [1, 2, 3, 4, 5] as number[],
    holidays: [] as Date[],
    floatingHolidays: 0,
    ptoDays: 0,
    enabledWidgets: ['timer', 'progress', 'contribution', 'stats'] as string[]
  });

  useEffect(() => {
    // Check if user is authenticated first
    if (!ctx.user) {
      console.log('User not authenticated, redirecting to login');
      window.location.href = '/user/login';
      return;
    }
    
    const countdownId = new URLSearchParams(window.location.search).get('id');
    console.log('Countdown ID from URL:', countdownId);
    
    if (countdownId) {
      loadCountdown(countdownId);
    } else {
      console.log('No countdown ID found, setting loading to false');
      setLoading(false);
    }
  }, [ctx.user]);

  const loadCountdown = async (id: string) => {
    try {
      const response = await fetch(`/api/countdowns/${id}`);
      
      if (response.ok) {
        const data = await response.json();
        setCountdown(data);
        setForm({
          name: data.name,
          description: data.description || '',
          targetDate: new Date(data.targetDate),
          workDays: data.workDays,
          holidays: data.holidays,
          floatingHolidays: data.floatingHolidays,
          ptoDays: data.ptoDays,
          enabledWidgets: data.enabledWidgets
        });
      } else {
        console.error('Failed to load countdown, status:', response.status);
        if (response.status === 401) {
          // User is not authenticated, redirect to login
          window.location.href = '/user/login';
          return;
        }
      }
    } catch (error) {
      console.error('Failed to load countdown:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleWorkDay = (day: number) => {
    setForm(prev => ({
      ...prev,
      workDays: prev.workDays.includes(day)
        ? prev.workDays.filter(d => d !== day)
        : [...prev.workDays, day]
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
    if (!form.name.trim() || !countdown) {
      alert('Please enter a name for your countdown');
      return;
    }

    setSaving(true);
    try {
      const response = await fetch(`/api/countdowns/${countdown.id}`, {
        method: 'PUT',
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
        alert('Countdown updated successfully!');
        window.location.href = '/manage';
      } else {
        console.error('Failed to update countdown');
        alert('Failed to update countdown. Please try again.');
      }
    } catch (error) {
      console.error('Failed to update countdown:', error);
      alert('Failed to update countdown. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <div className="text-2xl">Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!countdown) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <div className="text-2xl text-red-600">Countdown not found</div>
            <Button
              onClick={() => window.location.href = '/manage'}
              className="mt-4"
            >
              Back to Manage
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            Edit Countdown
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Update your countdown configuration
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
                placeholder="Brief description of your countdown"
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
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="floatingHolidays">Floating Holidays</Label>
                <Input
                  id="floatingHolidays"
                  type="number"
                  min="0"
                  value={form.floatingHolidays}
                  onChange={(e) => setForm(prev => ({ ...prev, floatingHolidays: parseInt(e.target.value) || 0 }))}
                  placeholder="Number of floating holidays"
                />
              </div>
              <div>
                <Label htmlFor="ptoDays">PTO Days</Label>
                <Input
                  id="ptoDays"
                  type="number"
                  min="0"
                  value={form.ptoDays}
                  onChange={(e) => setForm(prev => ({ ...prev, ptoDays: parseInt(e.target.value) || 0 }))}
                  placeholder="Number of PTO days"
                />
              </div>
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
            disabled={saving || !form.name.trim()}
            size="lg"
            className="min-w-32"
          >
            {saving ? "Saving..." : "Save Changes"}
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
