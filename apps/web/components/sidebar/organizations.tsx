import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { motion } from "framer-motion"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { ChevronsUpDown } from "lucide-react"
import { Plus } from "lucide-react"
import { UserCog, Users } from "lucide-react"
import Link from "next/link"
import { variants } from "./framer-props"
import { useEffect, useState } from "react";

export default function SidebarOrgDropdown({ isCollapsed }: { isCollapsed: boolean }) {
    const [org, setOrg] = useState<{ id: string; name: string } | null>(null);

    useEffect(() => {
        fetch("/api/user/organization")
            .then(res => res.ok ? res.json() : null)
            .then(data => {
                if (data && data.id && data.name) setOrg(data);
            });
    }, []);

    const displayName = org?.name || "Organization";
    const initials = org?.name ? org.name[0].toUpperCase() : "";

    return (
        <div className="flex h-[54px] w-full shrink-0 border-b p-2">
            <div className="mt-[1.5px] flex w-full">
                <DropdownMenu modal={false}>
                    <DropdownMenuTrigger className="w-full" asChild>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="flex w-fit items-center gap-2 px-2"
                        >
                            <Avatar className="rounded size-4">
                                <AvatarFallback>
                                    {initials ? (
                                        <motion.span
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ duration: 0.35, ease: 'easeIn' }}
                                        >
                                            {initials}
                                        </motion.span>
                                    ) : null}
                                </AvatarFallback>
                            </Avatar>
                            <motion.li variants={variants} className="flex w-fit items-center gap-2">
                                {!isCollapsed && (
                                    <>
                                        <span
                                            className="text-sm font-medium truncate max-w-[140px] text-left"
                                            title={displayName}
                                        >
                                            {displayName}
                                        </span>
                                        <ChevronsUpDown className="h-4 w-4 text-muted-foreground/50" />
                                    </>
                                )}
                            </motion.li>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                        <DropdownMenuItem asChild className="flex items-center gap-2">
                            <Link href="/settings/members">
                                <UserCog className="h-4 w-4" /> Manage members
                            </Link>
                        </DropdownMenuItem>

                        <DropdownMenuItem asChild>
                            <Link href="/settings/create-org" className="flex items-center gap-2">
                                <Plus className="h-4 w-4" />
                                Create organization
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href="/settings/join-org" className="flex items-center gap-2">
                                <Users className="h-4 w-4" />
                                Join organization
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
}