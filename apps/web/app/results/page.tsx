"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { ArrowLeft } from "lucide-react";
import { TestCase } from "../page";

interface FormData {
  signature: string;
  description: string;
  testCases: TestCase[];
  model: string;
}

export default function ResultsPage() {
  const router = useRouter();
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState<FormData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Retrieve form data from localStorage
    try {
      const storedData = localStorage.getItem("functionGeneratorData");
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        setFormData(parsedData);
      } else {
        setError("No function data found");
      }
    } catch (error) {
      console.error("Error retrieving form data:", error);
      setError("Error retrieving function data");
    }

    setIsLoading(false);
  }, []);

  const goBack = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="p-4 border-b flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={goBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Back
          </Button>
          <h1 className="text-xl font-semibold">Function Visualization</h1>
        </div>
        <ThemeToggle />
      </header>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar - can be used for controls or data display */}
        <div className="w-64 border-r p-4 overflow-y-auto">
          {isLoading ? (
            <p>Loading data...</p>
          ) : error ? (
            <div>
              <p className="text-destructive">{error}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={goBack}
                className="mt-4"
              >
                Return to Form
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-1">Function</h3>
                <p className="text-sm font-mono">{formData?.signature}</p>
              </div>

              <div>
                <h3 className="font-medium mb-1">Model</h3>
                <p className="text-sm">{formData?.model}</p>
              </div>

              <div>
                <h3 className="font-medium mb-1">Test Cases</h3>
                <p className="text-sm">{formData?.testCases.length} cases</p>
              </div>

              <div className="pt-2">
                <p className="text-xs text-muted-foreground">
                  Data is available in the console for React Flow integration
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Main canvas area - this is where you'll implement React Flow */}
        <div
          ref={canvasContainerRef}
          className="flex-1 bg-muted/20 overflow-hidden"
          style={{
            position: "relative",
            height: "calc(100vh - 65px)", // Adjust based on your header height
          }}
        >
          {/* This div will be your React Flow container */}
          <div
            id="react-flow-canvas"
            className="w-full h-full"
            style={{
              background: "rgba(250, 250, 250, 0.05)",
            }}
          >
            {/* React Flow will be mounted here */}
          </div>
        </div>
      </div>
    </div>
  );
}
