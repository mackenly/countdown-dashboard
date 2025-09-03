"use client";

import { useState, useEffect } from "react";
import { RequestInfo } from "rwsdk/worker";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
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

export function ManagePage({ ctx }: RequestInfo) {
  const [countdowns, setCountdowns] = useState<Countdown[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCountdown, setSelectedCountdown] = useState<Countdown | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingCountdown, setEditingCountdown] = useState<Countdown | null>(null);

  useEffect(() => {
    loadCountdowns();
  }, []);

  const loadCountdowns = async () => {
    try {
      const response = await fetch('/api/countdowns');
      if (response.ok) {
        const data: any = await response.json();
        setCountdowns(data.map((c: any) => ({
          ...c,
          targetDate: new Date(c.targetDate),
          holidays: c.holidays.map((d: string) => new Date(d))
        })));
      }
    } catch (error) {
      console.error('Failed to load countdowns:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteCountdown = async (id: string) => {
    if (!confirm('Are you sure you want to delete this countdown?')) {
      return;
    }

    try {
      const response = await fetch(`/api/countdowns/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await loadCountdowns();
        if (selectedCountdown?.id === id) {
          setSelectedCountdown(null);
        }
      }
    } catch (error) {
      console.error('Failed to delete countdown:', error);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDaysUntilTarget = (targetDate: Date) => {
    const now = new Date();
    const diffTime = targetDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              Loading Countdowns...
            </h1>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-2">
              Manage Countdowns
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Create and manage your countdown dashboards
            </p>
          </div>
          <Button
            onClick={() => window.location.href = "/create"}
            size="lg"
          >
            Create New Countdown
          </Button>
        </div>

        {/* Countdowns Grid */}
        {countdowns.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <div className="text-6xl mb-4">⏰</div>
              <h3 className="text-xl font-semibold mb-2">No Countdowns Yet</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                Create your first countdown to start tracking your work days
              </p>
              <Button
                onClick={() => window.location.href = "/create"}
                size="lg"
              >
                Create Your First Countdown
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {countdowns.map((countdown) => {
              const daysUntil = getDaysUntilTarget(countdown.targetDate);
              const isExpired = daysUntil <= 0;
              
              return (
                <Card key={countdown.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{countdown.name}</CardTitle>
                        {countdown.description && (
                          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                            {countdown.description}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedCountdown(countdown)}
                        >
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.location.href = `/edit?id=${countdown.id}`}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteCountdown(countdown.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600 dark:text-slate-400">Target Date:</span>
                        <span className="font-medium">{formatDate(countdown.targetDate)}</span>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600 dark:text-slate-400">Days Remaining:</span>
                        <span className={`font-medium ${isExpired ? 'text-green-600' : 'text-blue-600'}`}>
                          {isExpired ? 'Completed!' : `${daysUntil} days`}
                        </span>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600 dark:text-slate-400">Work Days:</span>
                        <span className="font-medium">
                          {countdown.workDays.map(d => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d]).join(', ')}
                        </span>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600 dark:text-slate-400">Widgets:</span>
                        <span className="font-medium">
                          {countdown.enabledWidgets.length} enabled
                        </span>
                      </div>
                      
                      <div className="pt-2">
                        <Button
                          onClick={() => window.location.href = `/?countdown=${countdown.id}`}
                          className="w-full"
                          size="sm"
                        >
                          View Dashboard
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Selected Countdown Details */}
        {selectedCountdown && (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Countdown Details: {selectedCountdown.name}</CardTitle>
                <Button
                  variant="outline"
                  onClick={() => setSelectedCountdown(null)}
                >
                  Close
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">Description</Label>
                    <p className="text-slate-600 dark:text-slate-400">
                      {selectedCountdown.description || 'No description provided'}
                    </p>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium">Target Date</Label>
                    <p className="text-slate-600 dark:text-slate-400">
                      {formatDate(selectedCountdown.targetDate)}
                    </p>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium">Work Schedule</Label>
                    <p className="text-slate-600 dark:text-slate-400">
                      {selectedCountdown.workDays.map(d => ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][d]).join(', ')}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">Holidays</Label>
                    <p className="text-slate-600 dark:text-slate-400">
                      {selectedCountdown.holidays.length} holidays configured
                    </p>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium">Time Off</Label>
                    <p className="text-slate-600 dark:text-slate-400">
                      {selectedCountdown.floatingHolidays} floating holidays, {selectedCountdown.ptoDays} PTO days
                    </p>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium">Enabled Widgets</Label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {selectedCountdown.enabledWidgets.map(widgetId => {
                        const widget = WIDGET_TYPES[widgetId as keyof typeof WIDGET_TYPES];
                        return widget ? (
                          <span key={widgetId} className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-sm">
                            {widget.icon} {widget.name}
                          </span>
                        ) : null;
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

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
