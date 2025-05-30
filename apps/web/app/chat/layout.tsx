import { ReactNode } from "react";
import { AppSidebar } from "@/components/layout/sidebar/app-sidebar";
import {
  SidebarProvider,
  SidebarInset,
} from "@/components/ui/sidebar";

export default function ChatLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
