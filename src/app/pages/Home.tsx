"use client";

import { useState, useEffect } from "react";
import { RequestInfo } from "rwsdk/worker";
import { Button } from "@/app/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { CountdownTimer } from "@/app/components/countdown/CountdownTimer";
import { ProgressIndicator } from "@/app/components/countdown/ProgressIndicator";
import { ContributionGrid } from "@/app/components/countdown/ContributionGrid";
import { calculateWorkDays, generateContributionData, formatTimeRemaining, WIDGET_TYPES } from "@/lib/countdown";

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

export function Home({ ctx }: RequestInfo) {
  const isLoggedIn = !!ctx.user?.username;
  const [countdowns, setCountdowns] = useState<Countdown[]>([]);
  const [selectedCountdown, setSelectedCountdown] = useState<Countdown | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoggedIn) {
      loadCountdowns();
    } else {
      setLoading(false);
    }
  }, [isLoggedIn]);

  const loadCountdowns = async () => {
    try {
      const response = await fetch('/api/countdowns');
      if (response.ok) {
        const data: any = await response.json();
        const countdownsData = data.map((c: any) => ({
          ...c,
          targetDate: new Date(c.targetDate),
          holidays: c.holidays.map((d: string) => new Date(d))
        }));
        setCountdowns(countdownsData);
        if (countdownsData.length > 0) {
          setSelectedCountdown(countdownsData[0]);
        }
      }
    } catch (error) {
      console.error('Failed to load countdowns:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              Countdown Dashboard
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400 mb-8">
              Track your work days until your target date with beautiful visualizations
            </p>
          </div>

          {/* What it does */}
          <Card className="mb-8">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">🎯 What This App Does</CardTitle>
              <CardDescription>
                A powerful countdown dashboard for tracking work days until your target date
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-lg text-slate-700 dark:text-slate-300">
                  This application helps you visualize and track the number of work days remaining until a specific date. 
                  Perfect for project deadlines, retirement countdowns, or any important milestone!
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div className="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <div className="text-2xl mb-2">📊</div>
                    <h3 className="font-semibold">Visual Analytics</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Charts, graphs, and progress indicators
                    </p>
                  </div>
                  <div className="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <div className="text-2xl mb-2">⚙️</div>
                    <h3 className="font-semibold">Customizable</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Set your work schedule, holidays, and PTO
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">⏰ Countdown Timer</CardTitle>
                <CardDescription>
                  Real-time countdown to your target date
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Live countdown showing days, hours, minutes, and seconds remaining.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">📅 Work Schedule</CardTitle>
                <CardDescription>
                  GitHub-style contribution grid
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Visual representation of your work days, holidays, and PTO.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">📊 Progress Tracking</CardTitle>
                <CardDescription>
                  Detailed progress indicators
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Track your progress with charts and percentage completion.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Sign In CTA */}
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">🔒 Get Started</CardTitle>
              <CardDescription>
                Sign in with your passkey to access your personal countdown dashboard
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button
                onClick={() => (window.location.href = "/user/login")}
                size="lg"
                className="min-w-48"
              >
                Sign In with Passkey
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              Loading Dashboard...
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Please wait while we load your countdown configuration.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (countdowns.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              Welcome, {ctx.user?.username}!
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Create your first countdown to get started
            </p>
          </div>

          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">🎯 No Countdowns Yet</CardTitle>
              <CardDescription>
                You haven't created any countdowns yet
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-slate-700 dark:text-slate-300">
                Create your first countdown to start tracking your work days until your target date.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => (window.location.href = "/create")}
                  size="lg"
                >
                  Create Countdown
                </Button>
                <Button
                  onClick={() => (window.location.href = "/manage")}
                  variant="outline"
                  size="lg"
                >
                  Manage Countdowns
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!selectedCountdown) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              No Countdown Selected
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Please select a countdown to view its dashboard.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Calculate countdown data
  const countdownData = calculateWorkDays(
    new Date(),
    selectedCountdown.targetDate,
    selectedCountdown.workDays,
    selectedCountdown.holidays,
    [], // PTO days (would need to be configured separately)
    selectedCountdown.floatingHolidays
  );

  const contributionData = generateContributionData(
    new Date(),
    selectedCountdown.targetDate,
    selectedCountdown.workDays,
    selectedCountdown.holidays,
    [] // PTO days
  );

  const renderWidget = (widgetId: string) => {
    switch (widgetId) {
      case 'timer':
        return <CountdownTimer key="timer" targetDate={selectedCountdown.targetDate} />;
      case 'progress':
        return (
          <ProgressIndicator
            key="progress"
            totalDays={countdownData.totalDays}
            remainingDays={countdownData.remainingWorkDays}
            percentageComplete={countdownData.percentageComplete}
          />
        );
      case 'contribution':
        return <ContributionGrid key="contribution" data={contributionData} />;
      case 'stats':
        return (
          <Card key="stats">
            <CardHeader>
              <CardTitle className="text-center text-xl">📈 Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{countdownData.workDays}</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Total Work Days</div>
                </div>
                <div className="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{countdownData.holidays}</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Holidays</div>
                </div>
                <div className="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">{selectedCountdown.floatingHolidays}</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Floating Holidays</div>
                </div>
                <div className="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{selectedCountdown.ptoDays}</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">PTO Days</div>
                </div>
              </div>
              
              <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 rounded-lg">
                <div className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  {formatTimeRemaining(countdownData.daysUntilTarget)}
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            {selectedCountdown.name}
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Welcome back, {ctx.user?.username}!
          </p>
          {selectedCountdown.description && (
            <p className="text-sm text-slate-500 dark:text-slate-500 mt-2">
              {selectedCountdown.description}
            </p>
          )}
        </div>

        {/* Countdown Selector */}
        {countdowns.length > 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Switch Countdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 justify-center">
                {countdowns.map((countdown) => (
                  <Button
                    key={countdown.id}
                    variant={selectedCountdown.id === countdown.id ? "default" : "outline"}
                    onClick={() => setSelectedCountdown(countdown)}
                    size="sm"
                  >
                    {countdown.name}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Widgets */}
        <div className="space-y-6">
          {selectedCountdown.enabledWidgets.map(widgetId => renderWidget(widgetId))}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => (window.location.href = "/manage")}
            size="lg"
          >
            Manage Countdowns
          </Button>
          <Button
            onClick={() => (window.location.href = "/create")}
            variant="outline"
            size="lg"
          >
            Create New
          </Button>
          <Button
            onClick={() => (window.location.href = "/account")}
            variant="outline"
            size="lg"
          >
            Account Settings
          </Button>
          <Button
            onClick={() => (window.location.href = "/user/logout")}
            variant="outline"
            size="lg"
          >
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
}
