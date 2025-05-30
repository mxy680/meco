"use client";

import Link from "next/link";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { CardDemo } from "@/components/ui/card-spotlight";
import Image from "next/image";
import { AuthButtons } from "./AuthButtons";

export default function Component() {
  return (
    <div className="min-h-screen bg-background flex">
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4 z-10">
        <ModeToggle />
      </div>

      {/* Left: Auth form, Right: CardDemo */}
      <div className="flex w-full">
        {/* Left side - Auth form */}
        <div className="w-full lg:w-1/2 flex justify-center items-center px-8 lg:px-32 lg:pl-40 min-h-screen">
          <div className="w-full max-w-md">
            {/* Logo */}
            {/* Logo */}
            <div className="mb-12">
              <div className="flex items-center gap-4">
                <Image
                  src="/favicon.png"
                  alt="MECO logo"
                  width={48}
                  height={48}
                  className="w-12 h-12 rounded-lg"
                />
                <div className="flex flex-col">
                  <span className="text-4xl font-bold text-foreground">
                    MECO
                  </span>
                  <span className="text-sm font-medium text-muted-foreground mt-1">
                    Micro Evolutionary Code Optimization
                  </span>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="space-y-8">
              <div>
                <h1 className="text-3xl font-semibold text-foreground mb-2">
                  Sign in to your account
                </h1>
              </div>

              {/* Auth Buttons */}
              <AuthButtons />

              {/* Legal Text */}
              <div className="text-sm text-muted-foreground">
                By signing in, you agree to our{" "}
                <Link href="#" className="underline hover:text-foreground">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="#" className="underline hover:text-foreground">
                  Privacy Policy
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - CardDemo */}
        <div className="hidden lg:flex w-1/2 min-h-screen items-center justify-center bg-transparent">
          <CardDemo />
        </div>
      </div>
    </div>
  );
}
