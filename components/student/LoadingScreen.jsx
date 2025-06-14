import React from "react";
import CustomBadge from "../common/badge";
import { LoaderCircle } from "lucide-react";

const LoadingScreen = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <CustomBadge />
      <LoaderCircle
        strokeWidth={2.5}
        size={50}
        className="animate-spin text-third"
      />
      <div>
        <h3>Wait for the teacher to ask a question..</h3>
      </div>
    </div>
  );
};

export default LoadingScreen;
