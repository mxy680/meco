"use client";

import Link from "next/link";

import { CardDemo } from "@/components/ui/card-spotlight";
import Image from "next/image";
import { AuthButtons } from "@/components/auth/oauth-buttons";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { motion } from "framer-motion";

export default function Component() {
  return (
    <AuroraBackground>
      <motion.div
        className="relative flex flex-col gap-4 items-center justify-center px-4"
      >
        <div className="w-full max-w-4xl rounded-2xl shadow-2xl drop-shadow-[0_8px_32px_rgba(0,0,0,0.45)] overflow-hidden bg-neutral-900/100 grid grid-cols-1 lg:grid-cols-2">
          {/* Left side - Auth form */}
          <div className="flex flex-col justify-center items-center w-full px-8 py-12">
            <div className="w-full max-w-sm">
              {/* Logo & Title */}
              <div className="mb-8 flex items-center gap-4">
                <Image
                  src="/favicon.png"
                  alt="MECO logo"
                  width={48}
                  height={48}
                  className="w-14 h-14 rounded-lg filter invert"
                  priority
                />
                <div>
                  <h1 className="text-3xl font-bold text-white tracking-tight leading-tight">
                    MECO
                  </h1>
                  <p className="text-xs text-neutral-400 font-medium mt-1">
                    Micro Evolutionary Code Optimization
                  </p>
                </div>
              </div>
              {/* Main Content */}
              <div className="space-y-7">
                <div>
                  <h2 className="text-2xl font-semibold text-white mb-1">Sign in to your account</h2>
                  <p className="text-sm text-neutral-400">Connect your Git provider to get started.</p>
                </div>
                <div className="space-y-3">
                  <AuthButtons />
                </div>
                <div className="text-xs text-neutral-500 mt-7">
                  By signing in, you agree to our{' '}
                  <Link href="#" className="underline hover:text-white">Terms of Service</Link> and{' '}
                  <Link href="#" className="underline hover:text-white">Privacy Policy</Link>.
                </div>
              </div>
            </div>
          </div>
          {/* Right side - CardDemo */}
          <div className="hidden lg:flex flex-1 items-center justify-center bg-neutral-900/100 rounded-r-2xl p-10 shadow-inner">
            <CardDemo />
          </div>
        </div>
      </motion.div>
    </AuroraBackground>
  );
}
