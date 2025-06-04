import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { MessagesSquare } from "lucide-react";
import { Layout } from "lucide-react";
import { Users, Flame } from "lucide-react";
import { CreditCard } from "lucide-react";
import { Gauge } from "lucide-react";
import { Blocks } from "lucide-react";
import { Bell } from "lucide-react";
import { BookOpen } from "lucide-react";
import { Code2 } from "lucide-react";
import type { Variants as MotionVariants } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import SidebarTab from "./tab";


export default function SidebarNavSection({ isCollapsed, variants, pathname }: { isCollapsed: boolean; variants: MotionVariants; pathname: string; }) {
    return (
        <ScrollArea className="h-16 grow p-2">
            <div className={cn("flex w-full flex-col gap-1")}>
                <SidebarTab
                    href="/chat"
                    icon={<MessagesSquare className="h-4 w-4" />}
                    label="Chat"
                    isActive={pathname?.includes("chat")}
                    isCollapsed={isCollapsed}
                    variants={variants}
                />
                <SidebarTab
                    href="/projects"
                    icon={<Layout className="h-4 w-4" />}
                    label="Projects"
                    isActive={pathname?.includes("projects")}
                    isCollapsed={isCollapsed}
                    variants={variants}
                />
                <SidebarTab
                    href="/community"
                    icon={<Users className="h-4 w-4" />}
                    label="Community"
                    isActive={pathname?.includes("community")}
                    isCollapsed={isCollapsed}
                    variants={variants}
                />
                <SidebarTab
                    href="/practice"
                    icon={<Flame className="h-4 w-4" />}
                    label="Practice"
                    isActive={pathname?.includes("practice")}
                    isCollapsed={isCollapsed}
                    variants={variants}
                />
                <Separator className="w-full" />
                <SidebarTab
                    href="/billing"
                    icon={<CreditCard className="h-4 w-4" />}
                    label="Billing"
                    isActive={pathname?.includes("billing")}
                    isCollapsed={isCollapsed}
                    variants={variants}
                />
                <SidebarTab
                    href="/usage"
                    icon={<Gauge className="h-4 w-4" />}
                    label="Usage"
                    isActive={pathname?.includes("usage")}
                    isCollapsed={isCollapsed}
                    variants={variants}
                />
                <SidebarTab
                    href="/settings/integrations"
                    icon={<Blocks className="h-4 w-4" />}
                    label="Integrations"
                    isActive={pathname?.includes("settings/integrations")}
                    isCollapsed={isCollapsed}
                    variants={variants}
                />
                <Separator className="w-full" />
                <SidebarTab
                    href="/notifications"
                    icon={<Bell className="h-4 w-4" />}
                    label="Notifications"
                    isActive={pathname?.includes("notifications")}
                    isCollapsed={isCollapsed}
                    variants={variants}
                />
                <SidebarTab
                    href="/docs"
                    icon={<BookOpen className="h-4 w-4" />}
                    label="Documentation"
                    isActive={pathname?.includes("docs")}
                    isCollapsed={isCollapsed}
                    variants={variants}
                />
                <SidebarTab
                    href="/api"
                    icon={<Code2 className="h-4 w-4" />}
                    label="API"
                    isActive={pathname?.includes("api")}
                    isCollapsed={isCollapsed}
                    variants={variants}
                >
                    <Badge className="flex h-fit w-fit items-center gap-1.5 rounded border-none bg-blue-50 px-1.5 text-blue-600 dark:bg-blue-700 dark:text-blue-300" variant="outline">BETA</Badge>
                </SidebarTab>
            </div>
        </ScrollArea>
    );
}