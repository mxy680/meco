import { ArrowLeft, ArrowRight, RotateCcw, ExternalLink, Search, Slash, Code2, Zap, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent
} from "@/components/ui/popover";

export default function DevConsoleNavbar() {
  return (
    <div className="bg-transparent border-b border-white/20 shadow-md">
      <div className="flex items-center justify-between px-4 py-2 h-12">
        {/* Left section - Logo and title */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-br from-orange-500 to-red-500 rounded-sm flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-sm opacity-90"></div>
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <button className="px-1 py-0.5 text-gray-200 hover:text-gray-300 text-sm font-medium rounded flex items-center gap-1">
                  notebook-insight-console
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 8L10 12L14 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-80 p-0 bg-[#18181b] border border-[#27272a] rounded-xl shadow-xl text-gray-100">
                {/* Go to Dashboard */}
                <button className="flex items-center gap-2 w-full px-4 py-3 text-gray-200 text-base font-medium rounded-t-xl focus:outline-none">
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6" /></svg>
                  Go to Dashboard
                </button>
                <div className="border-b border-[#27272a]" />
                {/* Project Name */}
                <div className="px-4 pt-3 pb-1">
                  <div className="text-sm text-gray-400 font-semibold mb-1">Mark&apos;s Lovable</div>
                  {/* Credits Used Card */}
                  <div className="bg-[#232326] rounded-lg p-4 mb-2 flex flex-col gap-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-base font-medium text-gray-100">Credits Used</span>
                      <button className="text-xs text-gray-300 underline">Manage</button>
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-full bg-gray-700 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '0%' }}></div>
                      </div>
                      <span className="text-xs text-gray-400">0/5</span>
                    </div>
                    <div className="flex items-center text-xs text-gray-400 gap-1">
                      0 of your daily credits used
                      <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="ml-1" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
                    </div>
                  </div>
                </div>
                <div className="border-b border-[#27272a]" />
                {/* Settings/Actions */}
                <div className="px-2 py-2 flex flex-col gap-1">
                  <button className="flex items-center gap-3 px-2 py-2 rounded text-sm text-gray-200">
                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 7 19.43a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82A1.65 1.65 0 0 0 3 12.9V12a2 2 0 0 1 0-4v-.09a1.65 1.65 0 0 0-1.51-1A1.65 1.65 0 0 0 2.57 7L2.5 7a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.09A1.65 1.65 0 0 0 7 4.57V4a2 2 0 0 1 4 0v.09c.28.02.56.09.81.21.25.12.49.28.7.49.21.21.37.45.49.7.12.25.19.53.21.81H13a1.65 1.65 0 0 0 1.51 1c.28 0 .56-.09.81-.21.25-.12.49-.28.7-.49.21-.21.37-.45.49-.7.12-.25.19-.53.21-.81V4a2 2 0 0 1 4 0v.09c.28.02.56.09.81.21.25.12.49.28.7.49.21.21.37.45.49.7.12.25.19.53.21.81H21a1.65 1.65 0 0 0 1.51 1c.28 0 .56-.09.81-.21.25-.12.49-.28.7-.49.21-.21.37-.45.49-.7.12-.25.19-.53.21-.81V4a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51A1.65 1.65 0 0 0 19.43 7h-.09a1.65 1.65 0 0 0-1.51 1V8a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51A1.65 1.65 0 0 0 12.9 3H12z" /></svg>
                    Settings <span className="ml-auto text-xs text-gray-400">⌘.</span>
                  </button>
                  <button className="flex items-center gap-3 px-2 py-2 rounded text-sm text-gray-200">
                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="" viewBox="0 0 24 24"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19.5 2 21l1.5-5L16.5 3.5z" /></svg>
                    Rename project
                  </button>
                  <button className="flex items-center gap-3 px-2 py-2 rounded text-sm text-gray-200">
                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="" viewBox="0 0 24 24"><path d="M12 3v1M12 20v1M4.22 4.22l.7.7M18.36 18.36l.7.7M1 12h1M20 12h1M4.22 19.78l.7-.7M18.36 5.64l.7-.7" /><circle cx="12" cy="12" r="5" /></svg>
                    Appearance
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-auto" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6" /></svg>
                  </button>
                  <button className="flex items-center gap-3 px-2 py-2 rounded text-sm text-gray-200">
                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M8 15h.01M12 15h.01M16 15h.01" /></svg>
                    Help
                  </button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Center section - Navigation controls */}
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-400">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-400">
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-400">
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-400">
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>

        {/* Right section - Search and actions */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-gray-400"
            >
              <Search className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-gray-400"
            >
              <Slash className="h-4 w-4" />
            </Button>
          </div>

          <div className="w-px h-6 bg-gray-700 mx-1"></div>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-gray-400"
            >
              <Code2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-gray-400"
            >
              <Zap className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-gray-400"
            >
              <Github className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-2 ml-2">
            <Button variant="ghost" size="sm" className="text-gray-300 px-3 h-8">
              Invite
            </Button>
            <Button size="sm" className="bg-blue-600 text-white px-4 h-8">
              Publish
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}