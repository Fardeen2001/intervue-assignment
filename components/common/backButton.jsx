import React from "react";
import { Button } from "../ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const BackButton = () => {
  const router = useRouter();
  return (
    <Button variant="ghost" className="mb-3" onClick={() => router.back()}>
      <ArrowLeft className="w-4 h-4" />
      Back
    </Button>
  );
};

export default BackButton;
