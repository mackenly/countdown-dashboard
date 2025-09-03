"use client";

import { RequestInfo } from "rwsdk/worker";
import { Button } from "@/app/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";

export function Account({ ctx }: RequestInfo) {
  const handleLogout = () => {
    window.location.href = "/user/logout";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            Account Dashboard
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Manage your account and countdown settings
          </p>
        </div>

        {/* User Info Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                {ctx.user?.username?.charAt(0).toUpperCase() || "U"}
              </div>
              User Information
            </CardTitle>
            <CardDescription>
              Your account details and authentication status
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Username
                </label>
                <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  {ctx.user?.username || "Unknown"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Authentication Method
                </label>
                <div className="mt-1">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                    Passkey Authentication
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">🔐 Secure Access</CardTitle>
              <CardDescription>
                Your account is protected with modern passkey authentication
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                No passwords required - just your biometric or device authentication.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">⚡ Fast & Reliable</CardTitle>
              <CardDescription>
                Built with modern web technologies for optimal performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Experience lightning-fast authentication and seamless user experience.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">🛡️ Privacy First</CardTitle>
              <CardDescription>
                Your data is protected with industry-standard security measures
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                We prioritize your privacy and security in everything we build.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Countdown Configuration Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                ⏰
              </div>
              Countdown Dashboard
            </CardTitle>
            <CardDescription>
              Configure your work schedule and target date for the countdown dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-slate-700 dark:text-slate-300">
                Set up your countdown configuration to track work days until your target date. 
                You can configure your work schedule, add holidays, and set PTO days.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={() => window.location.href = "/manage"}
                  size="lg"
                  className="flex-1"
                >
                  Manage Countdowns
                </Button>
                <Button
                  onClick={() => window.location.href = "/create"}
                  variant="outline"
                  size="lg"
                  className="flex-1"
                >
                  Create New
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={handleLogout}
            variant="outline"
            size="lg"
            className="w-full sm:w-auto"
          >
            Sign Out
          </Button>
          <Button
            onClick={() => window.location.href = "/"}
            size="lg"
            className="w-full sm:w-auto"
          >
            Go to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
