import React from "react";
import { Loader2 } from "lucide-react"; // or use any spinner icon

const LoadingScreen = () => {
  return (
    <div className="h-screen w-screen flex items-center justify-center bg-white text-blue-600">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="animate-spin w-10 h-10" />
        <p className="text-lg font-medium">Loading...</p>
      </div>
    </div>
  );
};

export default LoadingScreen;
