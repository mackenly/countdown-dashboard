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

export function Home({ ctx }: RequestInfo) {
  const isLoggedIn = !!ctx.user?.username;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Welcome to Countdown Dashboard
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 mb-8">
            A secure, modern web application with passkey authentication
          </p>
        </div>

        {/* Status Card */}
        <Card className="mb-8">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">
              {isLoggedIn ? "🎉 You're Signed In!" : "🔒 Authentication Required"}
            </CardTitle>
            <CardDescription>
              {isLoggedIn
                ? `Welcome back, ${ctx.user?.username}! You have access to protected features.`
                : "Sign in with your passkey to access protected content and features."}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            {isLoggedIn ? (
              <div className="space-y-4">
                <p className="text-lg text-slate-700 dark:text-slate-300">
                  You are logged in as <strong>{ctx.user?.username}</strong>
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={() => (window.location.href = "/protected")}
                    size="lg"
                  >
                    Go to Dashboard
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
            ) : (
              <div className="space-y-4">
                <p className="text-lg text-slate-700 dark:text-slate-300">
                  You are not currently logged in
                </p>
                <Button
                  onClick={() => (window.location.href = "/user/login")}
                  size="lg"
                >
                  Sign In with Passkey
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">🔐 Passkey Authentication</CardTitle>
              <CardDescription>
                Secure, passwordless authentication using WebAuthn
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                No passwords to remember or manage. Use your device's biometric authentication or security key.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">⚡ Modern Technology</CardTitle>
              <CardDescription>
                Built with cutting-edge web technologies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Powered by Cloudflare Workers, React Server Components, and modern web standards.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">🛡️ Privacy & Security</CardTitle>
              <CardDescription>
                Your data is protected with industry best practices
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                End-to-end security with no compromise on user experience or privacy.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
