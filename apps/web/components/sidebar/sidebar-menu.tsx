"use client";

import * as React from "react";
import { LayoutDashboard, BookText, Settings as SettingsIcon } from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,

} from "@/components/ui/sidebar";

// Accepts changes and tree props
import { Tree } from "@/components/sidebar/tree";

// Recursive type for file tree
export type FileTreeItem = string | FileTreeItem[];

interface SidebarMenuProps {
  tree: FileTreeItem[];
}

export function SidebarMenuSection({ tree }: SidebarMenuProps) {
  return (
    <>
      <SidebarGroup>
        <SidebarGroupLabel>Navigation</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Projects
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <BookText className="mr-2 h-4 w-4" />
                Documentation
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <SettingsIcon className="mr-2 h-4 w-4" />
                Settings
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
      <SidebarGroup>
        <SidebarGroupLabel>Files</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {tree.map((item, index) => (
              <Tree key={index} item={item} />
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </>
  );
}
