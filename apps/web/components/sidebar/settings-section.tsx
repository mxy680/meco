
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { motion } from "framer-motion";

import Link from "next/link";
import type { Variants as MotionVariants } from "framer-motion";
import { LogOut } from "lucide-react";
import { UserCircle } from "lucide-react";
import { DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { ChevronsUpDown } from "lucide-react";


import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import SettingsDialog from "../settings/settings-dialog";

export default function SidebarSettingsSection({ isCollapsed, variants }: { isCollapsed: boolean; variants: MotionVariants }) {
    const [user, setUser] = useState<{ name: string; email: string; image?: string } | null>(null);
    useEffect(() => {
        fetch("/api/user/profile")
            .then(res => res.ok ? res.json() : null)
            .then(data => {
                if (data && data.name && data.email) setUser(data);
            });
    }, []);

    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="flex flex-col p-2">
            <SettingsDialog open={isOpen} setOpen={setIsOpen} />

            <div>
                <DropdownMenu modal={false}>
                    <DropdownMenuTrigger className="w-full">
                        <div className="flex h-8 w-full flex-row items-center gap-2 rounded-md px-2 py-1.5  transition hover:bg-muted hover:text-primary">
                            <Avatar className="size-4">
                                {user?.image ? (
                                    <motion.img
                                        src={user.image}
                                        alt={user.name || "User avatar"}
                                        className="w-full h-full rounded-full object-cover"
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.35, ease: 'easeIn' }}
                                    />
                                ) : (
                                    <motion.span
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.35, ease: 'easeIn' }}
                                    >
                                        <AvatarFallback>
                                            {user?.name ? user.name.split(" ").map(n => n[0]).join("").toUpperCase() : "?"}
                                        </AvatarFallback>
                                    </motion.span>
                                )}
                            </Avatar>
                            <motion.li
                                variants={variants}
                                className="flex w-full items-center gap-2"
                            >
                                {!isCollapsed && (
                                    <>
                                        <p className="text-sm font-medium">Account</p>
                                        <ChevronsUpDown className="ml-auto h-4 w-4 text-muted-foreground/50" />
                                    </>
                                )}
                            </motion.li>
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent sideOffset={5} className="w-64">
                        <div className="flex flex-row items-center gap-2 p-2">
                            <Avatar className="size-6">
                                {user?.image ? (
                                    <motion.img
                                        src={user.image}
                                        alt={user.name || "User avatar"}
                                        className="w-full h-full rounded-full object-cover"
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.35, ease: 'easeIn' }}
                                    />
                                ) : (
                                    <motion.span
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.35, ease: 'easeIn' }}
                                    >
                                        <AvatarFallback>
                                            {user?.name ? user.name.split(" ").map(n => n[0]).join("").toUpperCase() : "?"}
                                        </AvatarFallback>
                                    </motion.span>
                                )}
                            </Avatar>
                            <div className="flex flex-col text-left">
                                <span className="text-sm font-medium">
                                    {user?.name || "Loading..."}
                                </span>
                                <span className="line-clamp-1 text-xs text-muted-foreground">
                                    {user?.email || " "}
                                </span>
                            </div>
                        </div>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            asChild
                            className="flex items-center gap-2"
                        >
                            <Link href="/settings/profile">
                                <UserCircle className="h-4 w-4" /> Profile
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className="flex items-center gap-2"
                            onClick={e => {
                                e.preventDefault();
                                signOut();
                            }}
                        >
                            <LogOut className="h-4 w-4" /> Sign out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
}