"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useState } from "react";
import SidebarSettingsSection from "./settings-section";
import SidebarNavSection from "./nav-section";
import SidebarOrgDropdown from "./organizations";
import { sidebarVariants, contentVariants, variants, transitionProps, staggerVariants } from "./framer-props";
import type { Variants as MotionVariants } from "framer-motion";

// Define the SidebarTabContext type at the top level
export type SidebarTabContext = {
  variants: MotionVariants;
  isCollapsed: boolean;
};

// Extend the Window interface to include sidebarTabContext
declare global {
  interface Window {
    sidebarTabContext: SidebarTabContext;
  }
}

// Main Sidebar composed from smaller components
export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const pathname = usePathname();

  return (
    <motion.div
      className={cn(
        "sidebar left-0 z-40 h-full shrink-0 border-r fixed",
      )}
      initial={isCollapsed ? "closed" : "open"}
      animate={isCollapsed ? "closed" : "open"}
      variants={sidebarVariants}
      transition={transitionProps}
      onMouseEnter={() => setIsCollapsed(false)}
      onMouseLeave={() => setIsCollapsed(true)}
    >
      <motion.div
        className={cn(
          "relative z-40 flex text-muted-foreground h-full shrink-0 flex-col transition-all",
          isCollapsed ? "bg-background" : "bg-white dark:bg-background"
        )}
        variants={contentVariants}
      >
        <motion.ul variants={staggerVariants} className="flex h-full flex-col">
          <SidebarOrgDropdown isCollapsed={isCollapsed} />
          <div className="flex h-full w-full flex-col">
            <div className="flex grow flex-col gap-4">
              <SidebarNavSection isCollapsed={isCollapsed} variants={variants} pathname={pathname} />
              <SidebarSettingsSection isCollapsed={isCollapsed} variants={variants} />
            </div>
          </div>
        </motion.ul>
      </motion.div>
    </motion.div>
  );
}
