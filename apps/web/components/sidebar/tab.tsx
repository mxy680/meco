
import { cn } from "@/lib/utils";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Variants as MotionVariants } from "framer-motion";

interface SidebarTabProps {
    href: string;
    icon: React.ReactNode;
    label: string;
    isActive?: boolean;
    isCollapsed: boolean;
    variants: MotionVariants;
    children?: React.ReactNode;
}

export default function SidebarTab({ href, icon, label, isActive, isCollapsed, variants, children }: SidebarTabProps) {
    return (
        <Link
            href={href}
            className={cn(
                "flex h-8 w-full flex-row items-center rounded-md px-2 py-1.5 transition hover:bg-muted hover:text-primary",
                isActive && "bg-muted text-blue-600"
            )}
        >
            {icon}
            <motion.li variants={variants}>
                {!isCollapsed && (
                    <span className="ml-2 text-sm font-medium flex items-center gap-2">
                        {label}
                        {children}
                    </span>
                )}
            </motion.li>
        </Link>
    );
}