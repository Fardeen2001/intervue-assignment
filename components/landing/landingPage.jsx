"use client";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import CustomBadge from "../common/badge";
import { useRouter } from "next/navigation";

const LandingPage = () => {
  const [selectedRole, setSelectedRole] = useState(null);
  const router = useRouter();

  const handleContinue = () => {
    console.log("Selected Role:", selectedRole);
    if (selectedRole === "student") {
      router.push("/auth/students/login");
    } else {
      router.push("/auth/teacher/login");
    }
  };
  return (
    <div className="min-h-screen container bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl mx-auto text-center space-y-8">
        <CustomBadge />
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">
            Welcome to the{" "}
            <span className="text-black">Live Polling System</span>
          </h1>
          <p className="text-gray-600 text-lg max-w-lg mx-auto">
            Please select the role that best describes you to begin using the
            live polling system
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <Card
            className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
              selectedRole === "student"
                ? "ring-2 ring-blue-500 border-blue-500"
                : "border-gray-200 hover:border-gray-300"
            }`}
            onClick={() => setSelectedRole("student")}
          >
            <CardContent className="p-4 text-left">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                I'm a Student
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Answer the polls created by your teacher and view the results in
                real-time.
              </p>
            </CardContent>
          </Card>

          <Card
            className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
              selectedRole === "teacher"
                ? "ring-2 ring-blue-500 border-blue-500"
                : "border-gray-200 hover:border-gray-300"
            }`}
            onClick={() => setSelectedRole("teacher")}
          >
            <CardContent className="p-4 text-left">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                I'm a Teacher
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Create the polls and evaluate the students in real-time.
              </p>
            </CardContent>
          </Card>
        </div>
        <div className="pt-4">
          <Button
            size="lg"
            className="bg-purple-600 hover:bg-purple-700 text-white px-12 py-3 rounded-full text-lg font-medium"
            onClick={handleContinue}
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
