"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LightbulbIcon, Loader2 } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import {
  loadSampleDataFactorial,
  loadSampleDataForReverseString,
  loadSampleDataMatrixMultiplication,
  loadSampleDataFibonacci,
  loadSampleDataIsPrime,
  loadSampleDataSumArray,
} from "@/utils/sample-functions";

export type TestValue = string | number | boolean | null;

export interface TestCase {
  inputs: Record<string, TestValue>;
  input_types: Record<string, string>;
  expected_output: TestValue;
  expected_output_type: string;
}

export default function FunctionGeneratorPage() {
  const router = useRouter();
  const [signature, setSignature] = useState("");
  const [description, setDescription] = useState("");
  const [testCasesJson, setTestCasesJson] = useState("");
  const [model, setModel] = useState("gpt-4o-2024-08-06");
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Validate JSON when it changes
  useEffect(() => {
    if (!testCasesJson) {
      setJsonError(null);
      return;
    }

    try {
      const parsed = JSON.parse(testCasesJson);
      if (!Array.isArray(parsed)) {
        setJsonError("JSON must be an array of test cases");
        return;
      }

      // Check if each test case has the required fields
      for (const testCase of parsed) {
        if (
          !testCase.inputs ||
          !testCase.input_types ||
          !("expected_output" in testCase) ||
          !testCase.expected_output_type
        ) {
          setJsonError(
            "Each test case must have inputs, input_types, expected_output, and expected_output_type"
          );
          return;
        }
      }

      setJsonError(null);
    } catch {
      setJsonError("Invalid JSON format");
    }
  }, [testCasesJson]);

  const generateFunction = async () => {
    if (jsonError) return;

    try {
      setIsGenerating(true);

      // Show a loading toast
      const toastId = toast.loading("Validating Request");

      // Parse test cases
      const testCases = JSON.parse(testCasesJson);

      // Prepare request data
      const requestData = {
        signature,
        description,
        testCases,
        model,
      };

      // Call the API route
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error("Failed to generate function");
      }

      // Get the response data
      const responseData = await response.json();

      // Store both the form data and the API response in localStorage
      const combinedData = {
        formData: requestData,
        apiResponse: responseData,
      };

      localStorage.setItem("jobData", JSON.stringify(combinedData));

      // Dismiss the loading toast and show a success toast
      toast.dismiss(toastId);
      toast.success("Function generated successfully");

      // Navigate to the results page
      router.push("/results");
    } catch (error) {
      console.error("Error generating function:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to generate function"
      );
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <header className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold">Function Generator</h1>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                loadSampleDataFactorial(
                  setSignature,
                  setDescription,
                  setModel,
                  setTestCasesJson
                );
              }}
              className="flex items-center gap-2"
            >
              <LightbulbIcon size={16} />
              Load Sample Data
            </Button>
          </div>
          <ThemeToggle />
        </header>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Function Details</CardTitle>
              <CardDescription>
                Define the signature and description of your function
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signature">Function Signature</Label>
                <Input
                  id="signature"
                  placeholder="def factorial(n: int) -> int"
                  value={signature}
                  onChange={(e) => setSignature(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Calculate the factorial of a non-negative integer n"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Test Cases (JSON)</CardTitle>
              <CardDescription>
                Enter test cases as a JSON array
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Textarea
                  id="testCases"
                  placeholder={`[
  {
    "inputs": { "n": 0 },
    "input_types": { "n": "int" },
    "expected_output": 1,
    "expected_output_type": "int"
  }
]`}
                  value={testCasesJson}
                  onChange={(e) => setTestCasesJson(e.target.value)}
                  className="min-h-[300px] font-mono text-sm"
                />
                {jsonError && (
                  <Alert variant="destructive">
                    <AlertDescription>{jsonError}</AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Model</CardTitle>
              <CardDescription>
                Select which AI model to use for code generation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={model} onValueChange={setModel}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt-4o-2024-08-06">
                    gpt-4o-2024-08-06
                  </SelectItem>
                  <SelectItem value="claude-3-opus">claude-3-opus</SelectItem>
                  <SelectItem value="claude-3-sonnet">
                    claude-3-sonnet
                  </SelectItem>
                  <SelectItem value="gemini-pro">gemini-pro</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                onClick={generateFunction}
                disabled={
                  !signature ||
                  !description ||
                  !testCasesJson ||
                  !!jsonError ||
                  isGenerating
                }
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Generate Function"
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
