"use client";

import React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, GraduationCap } from "lucide-react";
import BackButton from "@/components/common/backButton";

export default function TeacherLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate login process
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Here you would typically handle authentication
    console.log("Teacher login:", { email, password });

    setIsLoading(false);
    // Redirect to teacher dashboard after successful login
    // router.push("/teacher/dashboard")
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <BackButton />

        <Card className="shadow-lg">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Teacher Login
              </CardTitle>
              <p className="text-gray-600 mt-2">Sign in to manage your polls</p>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-11"
                />
              </div>

              <div className="flex items-center justify-between">
                <Link
                  href="#"
                  className="text-sm text-purple-600 hover:text-purple-800"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 h-11"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="text-center">
              <p className="text-gray-600">
                Don't have an account?{" "}
                <Link
                  href="/auth/teacher/signup"
                  className="text-purple-600 hover:text-purple-800 font-medium"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
