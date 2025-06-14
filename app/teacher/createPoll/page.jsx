"use client";

import React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ChevronDown, Eye, Plus } from "lucide-react";
import CustomBadge from "@/components/common/badge";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function CreatePoll() {
  const router = useRouter();
  const [question, setQuestion] = useState("");
  const [timeLimit, setTimeLimit] = useState(60);
  const [options, setOptions] = useState([
    { id: 1, text: "", isCorrect: true },
    { id: 2, text: "", isCorrect: false },
  ]);
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);

  const addOption = () => {
    if (options.length < 6) {
      setOptions([
        ...options,
        { id: options.length + 1, text: "", isCorrect: false },
      ]);
    }
  };

  const updateOption = (id, text) => {
    setOptions(
      options.map((option) => (option.id === id ? { ...option, text } : option))
    );
  };

  const updateCorrectness = (id, isCorrect) => {
    setOptions(
      options.map((option) =>
        option.id === id ? { ...option, isCorrect } : option
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/createPoll`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            question,
            options: options.map((option) => ({
              option: option.text,
              isCorrect: option.isCorrect,
            })),
            timeLimit,
          }),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to create poll");
      }
      toast("Poll created successfully");
      router.push("/teacher/dashboard");
    } catch (error) {
      console.error("Error creating poll:", error);
      toast(error.message || "An error occurred while creating the poll");
    }
  };

  const timeOptions = [30, 60, 90];

  return (
    <div className="min-h-screen bg-custom-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div>
          <div className="mb-4 flex items-center justify-between">
            <CustomBadge />
            <Button
              onClick={() => router.push("/teacher/dashboard")}
              className="pt-2"
            >
              <Eye /> View History
            </Button>
          </div>

          <div className="mb-6">
            <h1 className="text-3xl text-custom-gray">
              Let{"'"}s{" "}
              <span className="text-black font-bold">Get Started</span>
            </h1>
            <p className="text-gray-600 mt-2">
              you{"'"}ll have the ability to create and manage polls, ask
              questions, and monitor your students' responses in real-time.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <label
              htmlFor="question"
              className="block text-sm font-medium text-gray-700"
            >
              Enter your question
            </label>
            <div className="relative">
              <div
                type="button"
                className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md bg-custom-white text-sm font-medium text-custom-gray hover:bg-custom-gray/20"
                onClick={() => setShowTimeDropdown(!showTimeDropdown)}
              >
                {timeLimit} seconds <ChevronDown className="ml-2 h-4 w-4" />
              </div>
              {showTimeDropdown && (
                <div className="absolute right-0 mt-1 w-40 bg-custom-white shadow-lg rounded-md z-10 border border-gray-200">
                  <ul className="py-1">
                    {timeOptions.map((option) => (
                      <li key={option}>
                        <div
                          type="button"
                          className="block cursor-pointer w-full text-left px-4 py-2 text-sm text-custom-gray hover:bg-custom-gray/20"
                          onClick={() => {
                            setTimeLimit(option);
                            setShowTimeDropdown(false);
                          }}
                        >
                          {option} seconds
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <div>
            <Textarea
              id="question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Enter your question here"
              className="w-full bg-custom-gray/10 h-full text-base"
              maxLength={100}
            />
            <div className="flex justify-end mt-1">
              <span className="text-xs text-custom-gray">
                {question?.length}/100
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-custom-gray mb-3">
                Edit Options
              </h3>
              <div className="space-y-3">
                {options.map((option, index) => (
                  <div key={option.id} className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                      <span className="text-custom-white text-xs">
                        {index + 1}
                      </span>
                    </div>
                    <Input
                      value={option.text}
                      onChange={(e) => updateOption(option.id, e.target.value)}
                      placeholder="Enter option text"
                      className="flex-1 bg-custom-gray/10"
                    />
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  onClick={addOption}
                  disabled={options.length >= 6}
                  className="flex items-center gap-1 text-sm bg-transparent!"
                >
                  <Plus className="h-3 w-3" />
                  Add More option
                </Button>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-custom-gray mb-3">
                Is it Correct?
              </h3>
              <div className="space-y-3">
                {options.map((option) => (
                  <div key={option.id} className="flex items-center h-10">
                    <RadioGroup
                      value={option.isCorrect ? "yes" : "no"}
                      onValueChange={(value) =>
                        updateCorrectness(option.id, value === "yes")
                      }
                      className="flex items-center space-x-4"
                    >
                      <div className="flex items-center space-x-1">
                        <RadioGroupItem value="yes" id={`yes-${option.id}`} />
                        <Label htmlFor={`yes-${option.id}`} className="text-sm">
                          Yes
                        </Label>
                      </div>
                      <div className="flex items-center space-x-1">
                        <RadioGroupItem value="no" id={`no-${option.id}`} />
                        <Label htmlFor={`no-${option.id}`} className="text-sm">
                          No
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <Button onClick={handleSubmit} className="px-8 py-2 rounded-full">
              Ask Question
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
