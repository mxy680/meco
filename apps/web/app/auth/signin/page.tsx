"use client";

import { AuroraBackground } from "@/components/ui/aurora-background";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { SignInCard } from "@/components/auth/signin-card";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

export default function Component() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  useEffect(() => {
    if (error) {
      let message = "An unknown error occurred.";
      if (error === "OAuthAccountNotLinked") {
        message = "This email is already linked to another account. Please sign in using the originally linked provider.";
      }
      toast.error(message);
    }
  }, [error]);

  return (
    <>
      {/* Mode toggle in top right corner */}
      <div className="fixed top-4 right-4 z-50">
        <ModeToggle />
      </div>
      <AuroraBackground>
        <SignInCard />
        <Toaster />
      </AuroraBackground>
    </>
  );
}
