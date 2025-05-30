"use client";

import { ReactNode } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { LLMModelCombobox } from "./llm-model-combobox";
import { DefaultBreadcrumb } from "./default-breadcrumb";

interface NavbarProps {
  children?: ReactNode; // for custom breadcrumbs if needed
}

export function Navbar({ children }: NavbarProps) {
  return (
    <header className="flex h-16 shrink-0 items-center border-b px-4">
      {/* Left: Sidebar trigger and breadcrumb */}
      <div className="flex items-center gap-2 min-w-0 flex-1">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />
        {children ? (
          children
        ) : (
          <DefaultBreadcrumb items={["components", "ui", "button.tsx"]} />
        )}
      </div>
      {/* Center: Project title */}
      <div className="flex-1 flex justify-center items-center pointer-events-none select-none">
        <h2 className="text-2xl font-semibold tracking-tight text-center text-foreground">
          Image Segmentation
        </h2>
      </div>
      {/* Right: LLM Model Dropdown and Mode Toggle */}
      <div className="flex items-center flex-1 justify-end gap-2">
        <LLMModelCombobox />
        <ModeToggle />
      </div>
    </header>
  );
}
