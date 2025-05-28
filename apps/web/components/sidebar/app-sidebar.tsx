"use client";

import * as React from "react";
import { File, Folder } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarRail,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { TeamSwitcher } from "@/components/sidebar/teams";
import { User } from "@/components/sidebar/user";
import { SidebarMenuSection } from "@/components/sidebar/sidebar-menu";

// This is sample data.
const data = {
  user: {
    name: "Mark Shteyn",
    email: "mark@mxy680.net",
    avatar: "https://avatars.githubusercontent.com/u/137646214?v=4",
  },
  teams: [
    {
      name: "Personal",
      logo: File,
      plan: "Free",
    },
    {
      name: "Acme Corp",
      logo: Folder,
      plan: "Pro",
    },
  ],
  changes: [
    {
      file: "README.md",
      state: "M",
    },
    {
      file: "api/hello/route.ts",
      state: "U",
    },
    {
      file: "app/layout.tsx",
      state: "M",
    },
  ],
  tree: [
    [
      "app",
      [
        "api",
        ["hello", ["route.ts"]],
        "page.tsx",
        "layout.tsx",
        ["blog", ["page.tsx"]],
      ],
    ],
    [
      "components",
      ["ui", "button.tsx", "card.tsx"],
      "header.tsx",
      "footer.tsx",
    ],
    ["lib", ["util.ts"]],
    ["public", "favicon.ico", "vercel.svg"],
    ".eslintrc.json",
    ".gitignore",
    "next.config.js",
    "tailwind.config.js",
    "package.json",
    "README.md",
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenuSection tree={data.tree} />
      </SidebarContent>
      <SidebarRail />
      <SidebarFooter>
        <User user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
