import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function SignIn() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      {/* Left side - Auth form */}
      <div className="flex-1 flex items-center justify-center px-4 py-8 lg:py-0">
        <div className="w-full max-w-md space-y-8">
          {/* Main Content */}
          <div className="text-center space-y-6">
            <div className="space-y-4">
              <h1 className="text-3xl font-normal text-gray-900">
                Sign in to MECO
              </h1>
              <p className="text-gray-600">
                Choose your Git provider to continue
              </p>
            </div>

            {/* Legal Text */}
            <div className="text-sm text-gray-600 leading-relaxed">
              By signing in, you acknowledge that you have read, understood, and
              agree to MECO&apos;s{" "}
              <Link href="#" className="underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="#" className="underline">
                Privacy Policy
              </Link>
              .
            </div>

            {/* Auth Buttons */}
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full h-12 text-base font-normal bg-white border-gray-300 hover:bg-gray-50"
              >
                <div className="flex items-center justify-center gap-3">
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.30.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  Sign in with GitHub
                </div>
              </Button>

              <Button
                variant="outline"
                className="w-full h-12 text-base font-normal bg-white border-gray-300 hover:bg-gray-50"
              >
                <div className="flex items-center justify-center gap-3">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#0052CC">
                    <path d="M.778 1.213a.768.768 0 00-.768.892l3.263 19.81c.084.5.515.868 1.022.873H19.95a.772.772 0 00.77-.646l3.27-20.03a.768.768 0 00-.768-.891zM14.52 15.53H9.522L8.17 8.466h7.704z" />
                  </svg>
                  Sign in with Bitbucket
                </div>
              </Button>

              <Button
                variant="outline"
                className="w-full h-12 text-base font-normal bg-white border-gray-300 hover:bg-gray-50"
              >
                <div className="flex items-center justify-center gap-3">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#FC6D26">
                    <path d="M23.955 13.587l-1.342-4.135-2.664-8.189c-.135-.423-.73-.423-.867 0L16.418 9.45H7.582L4.919 1.263c-.135-.423-.73-.423-.867 0L1.388 9.452-.955 13.587a.849.849 0 00.308 1.005L12 23.054l10.647-8.462a.849.849 0 00.308-1.005" />
                  </svg>
                  Sign in with GitLab
                </div>
              </Button>

              <Button
                variant="outline"
                className="w-full h-12 text-base font-normal bg-white border-gray-300 hover:bg-gray-50"
              >
                <div className="flex items-center justify-center gap-3">
                  <span className="text-lg">🤗</span>
                  Sign in with HuggingFace
                </div>
              </Button>
            </div>

            {/* Footer */}
            <div className="text-center text-gray-600">
              <span>Need another provider?</span>
              <br />
              <Link href="#" className="underline">
                Contact our team
              </Link>{" "}
              to request a trial.
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Placeholder image */}
      <div className="flex-1 bg-gray-100 flex items-center justify-center p-4 lg:p-8">
        <div className="relative w-full h-64 lg:h-96 xl:h-[500px] 2xl:h-[600px] max-w-4xl">
          <Image
            src="/placeholder.svg?height=600&width=800&query=code optimization dashboard"
            alt="MECO Dashboard Preview"
            fill
            className="object-contain"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
        </div>
      </div>
    </div>
  );
}
