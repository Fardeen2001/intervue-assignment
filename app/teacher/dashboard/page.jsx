"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import CustomBadge from "@/components/common/badge";
import PollHistory from "@/components/teacher/pollHistory";

export default function TeacherDashboard() {
  const router = useRouter();
  const [polls, setPolls] = useState([]);
  const fetchPolls = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/getpolls`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch polls");
      }
      const data = await response.json();
      setPolls(data);
    } catch (error) {
      console.error("Error fetching polls:", error);
      toast.error("Failed to fetch polls. Please try again later.");
    }
  };
  useEffect(() => {
    fetchPolls();
  }, []);
  const handleCreateNewPoll = () => {
    router.push("/teacher/createPoll");
  };

  return (
    <div className="min-h-screen bg-custom-gray/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <CustomBadge />

        <Button
          onClick={handleCreateNewPoll}
          className="bg-primary hover:bg-primary/70 text-custom-white flex items-center gap-2"
        >
          <PlusCircle className="h-4 w-4" />
          Ask a New Question
        </Button>
      </div>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-3xl mb-6">
          View <span className="font-bold">Poll History</span>
        </h2>

        <PollHistory polls={polls} />
      </main>
    </div>
  );
}
