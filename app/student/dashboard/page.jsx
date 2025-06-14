"use client";
import LoadingScreen from "@/components/student/LoadingScreen";
import { cn } from "@/lib/utils";
import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import { toast } from "sonner";

const Dashboard = () => {
  const [queue, setQueue] = useState([]);
  const [current, setCurrent] = useState(null);
  const [past, setPast] = useState([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [voted, setVoted] = useState(false);
  const timerRef = useRef(null);
  const socketRef = useRef(null);

  const advancePoll = () => {
    clearInterval(timerRef.current);
    if (current) {
      setPast((prev) => [current, ...prev]);
    }

    setQueue((prevQueue) => {
      if (prevQueue.length === 0) {
        setCurrent(null);
        setTimeLeft(0);
        setVoted(false);
        return [];
      }
      const [next, ...rest] = prevQueue;
      setCurrent(next);
      setTimeLeft(next.timeLimit);
      setVoted(false);

      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            advancePoll();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return rest;
    });
  };

  const handleVote = async (optionId) => {
    if (voted || timeLeft === 0 || !current) return;
    setVoted(true);
    clearInterval(timerRef.current);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/polls/${current._id}/vote`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ optionId }),
        }
      );
      if (!res.ok) throw new Error("Vote failed");
      const updated = await res.json();
      setCurrent(updated);
      setTimeout(() => {
        advancePoll();
      }, 3000);
    } catch (err) {
      console.error(err);
      toast.error("Error voting, please try again.");
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            advancePoll();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      setVoted(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return toast.error("Please login first");

    const socket = io(process.env.NEXT_PUBLIC_SERVER_URL, {
      path: "/socket.io",
      auth: { token },
    });
    socketRef.current = socket;

    socket.on("newPoll", (poll) => {
      setQueue((prev) => [...prev, poll]);
    });

    socket.on("pollUpdated", (poll) => {
      setQueue((prev) => prev.map((p) => (p._id === poll._id ? poll : p)));
      if (current?._id === poll._id) {
        setCurrent(poll);
      }
    });

    socket.on("connect_error", (e) => toast.error("Socket error"));

    return () => {
      clearInterval(timerRef.current);
      socket.disconnect();
    };
  }, [current]);

  useEffect(() => {
    if (!current && queue.length > 0) {
      advancePoll();
    }
  }, [queue, current]);

  return (
    <div className="m-auto w-[50%] mt-5">
      {current ? (
        <PollView
          poll={current}
          timeLeft={timeLeft}
          voted={voted}
          onVote={handleVote}
          isActive
        />
      ) : queue.length > 0 ? (
        <div style={prepStyle}>Preparing next poll...</div>
      ) : (
        <div style={prepStyle}>
          <p>Waiting for polls from teacher...</p>
        </div>
      )}

      {past.length > 0 && (
        <div>
          <h3>Previous Questions</h3>
          {past.map((p, i) => (
            <PollView
              key={p._id}
              poll={p}
              readOnly
              questionNumber={past.length - i}
            />
          ))}
        </div>
      )}
      {!current && queue.length === 0 && <LoadingScreen />}
    </div>
  );
};

const prepStyle = {
  textAlign: "center",
  padding: 40,
  background: "#f8f9fa",
  borderRadius: 8,
};

function PollView({
  poll,
  timeLeft,
  voted,
  onVote,
  readOnly = false,
  isActive = false,
  questionNumber,
}) {
  const showResults = readOnly || voted || timeLeft === 0;
  const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Question {questionNumber}</h3>
        {isActive && timeLeft > 0 && (
          <div
            className={cn(
              "text-lg font-bold",
              timeLeft <= 10 ? "text-red-600" : "text-green-600"
            )}
          >
            ⏰ Time Remaining: {timeLeft} seconds
          </div>
        )}
      </div>
      <div className="border border-custom-gray rounded-md">
        <div className="bg-linear-to-r from-custom-black to-custom-gray text-custom-white p-4 rounded-md">
          <p>{poll.question}</p>
        </div>
        <div className="space-y-3 p-5">
          {poll.options.map((option, index) => {
            const isCorrect = option.isCorrect;
            const percentage =
              totalVotes > 0
                ? ((option.votes / totalVotes) * 100).toFixed(1)
                : 0;

            return (
              <div key={option._id} className="space-y-1">
                <div
                  className="flex items-center"
                  disabled={readOnly || voted || timeLeft === 0}
                  onClick={() => onVote && onVote(option._id)}
                >
                  <div className="flex-1 mr-4">
                    <div className="h-12 bg-custom-gray/20 rounded-md overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-md flex items-center",
                          showResults && isCorrect ? "bg-green-300" : "bg-third"
                        )}
                        style={
                          showResults ? { width: `${percentage}%` } : undefined
                        }
                      >
                        <span className="absolute bg-custom-white rounded-full w-5 h-5 text-black font-medium text-center ml-3 flex items-center justify-center">
                          {index + 1}
                        </span>
                        <span
                          className={cn(
                            "text-custom-white text-lg font-semibold ml-10",
                            showResults && percentage < 10
                              ? "text-custom-black"
                              : "text-custom-white"
                          )}
                        >
                          {option.option}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="w-12 text-right">
                    {showResults && (
                      <span className="text-custom-black font-medium">
                        {percentage}%
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
