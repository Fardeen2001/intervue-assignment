"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, CheckCircle } from "lucide-react";

export default function PollHistory({ polls }) {
  const [expandedPolls, setExpandedPolls] = useState(new Set());

  const togglePollResults = (pollId) => {
    const newExpanded = new Set(expandedPolls);
    if (newExpanded.has(pollId)) {
      newExpanded.delete(pollId);
    } else {
      newExpanded.add(pollId);
    }
    setExpandedPolls(newExpanded);
  };

  const calculatePercentages = (options) => {
    const totalVotes = options.reduce((sum, option) => sum + option.votes, 0);
    return options.map((option) => ({
      ...option,
      percentage:
        totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0,
    }));
  };

  return (
    <div className="space-y-10">
      {polls.map((poll, pollIndex) => {
        const optionsWithPercentages = calculatePercentages(poll.options);
        const isExpanded = expandedPolls.has(poll._id);

        return (
          <div key={poll._id} className="space-y-4">
            <h3 className="text-lg font-medium">Question {pollIndex + 1}</h3>
            <div className="border border-custom-gray rounded-md">
              <div className="bg-gradient-to-r from-custom-black to-custom-gray text-custom-white p-4 rounded-t-md">
                <p>{poll.question}</p>
              </div>
              <div className="space-y-3 p-5">
                {optionsWithPercentages.map((option, optionIndex) => (
                  <div key={option._id} className="space-y-1">
                    <div className="flex items-center">
                      <div className="flex-1 mr-4">
                        <div className="h-12 bg-custom-gray/20 rounded-md overflow-hidden relative">
                          <div
                            className="h-full bg-third rounded-md flex items-center transition-all duration-300"
                            style={{ width: `${option.percentage}%` }}
                          >
                            <span className="absolute bg-custom-white rounded-full w-5 h-5 text-third text-xs font-medium text-center ml-3 flex items-center justify-center z-10">
                              {optionIndex + 1}
                            </span>
                            <span
                              className={cn(
                                "text-custom-white text-lg font-semibold ml-10",
                                option.percentage < 10 && "text-custom-black"
                              )}
                            >
                              {option.option}
                            </span>
                          </div>
                          {option.isCorrect && isExpanded && (
                            <CheckCircle className="absolute right-2 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
                          )}
                        </div>
                      </div>
                      <div className="w-12 text-right">
                        <span className="text-custom-black font-medium">
                          {option.percentage}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="pt-4 border-t border-custom-gray/30">
                  <Button
                    onClick={() => togglePollResults(poll._id)}
                    variant="outline"
                    className="w-full flex items-center justify-center gap-2"
                  >
                    View Results
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </Button>
                </div>

                {isExpanded && (
                  <div className="mt-4 space-y-4 bg-gray-50 p-4 rounded-md">
                    <h4 className="font-semibold text-custom-black mb-3">
                      Detailed Results
                    </h4>

                    {/* Show correct answer */}
                    {optionsWithPercentages.find((opt) => opt.isCorrect) && (
                      <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <span className="font-medium text-green-800">
                            Correct Answer:{" "}
                            {
                              optionsWithPercentages.find(
                                (opt) => opt.isCorrect
                              )?.option
                            }
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Show voters for each option */}
                    {optionsWithPercentages.map((option, optionIndex) => (
                      <div
                        key={option._id}
                        className="border border-gray-200 rounded-md p-3"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="bg-third text-white rounded-full w-6 h-6 text-sm font-medium flex items-center justify-center">
                              {optionIndex + 1}
                            </span>
                            <span className="font-medium">{option.option}</span>
                            {option.isCorrect && (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            )}
                          </div>
                          <span className="text-sm text-gray-600">
                            {option.votes} vote{option.votes !== 1 ? "s" : ""} (
                            {option.percentage}%)
                          </span>
                        </div>

                        {option.votedBy && option.votedBy.length > 0 ? (
                          <div className="space-y-1">
                            <p className="text-sm font-medium text-gray-700">
                              Voted by:
                            </p>
                            <div className="space-y-1">
                              {option.votedBy.map((voter) => (
                                <div
                                  key={voter._id}
                                  className="text-sm text-gray-600 bg-white p-2 rounded border"
                                >
                                  <span className="font-medium">
                                    {voter.firstName} {voter.lastName}
                                  </span>
                                  <span className="text-gray-500 ml-2">
                                    ({voter.email})
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500 italic">
                            No votes for this option
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
