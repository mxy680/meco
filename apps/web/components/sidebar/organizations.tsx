import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { motion } from "framer-motion"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { ChevronsUpDown } from "lucide-react"
import { Plus } from "lucide-react"
import { UserCog } from "lucide-react"
import { Blocks } from "lucide-react"
import Link from "next/link"
import { variants } from "./framer-props"

export default function SidebarOrgDropdown({ isCollapsed }: { isCollapsed: boolean }) {
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
                                <AvatarFallback>O</AvatarFallback>
                            </Avatar>
                            <motion.li variants={variants} className="flex w-fit items-center gap-2">
                                {!isCollapsed && (
                                    <>
                                        <p className="text-sm font-medium">{"Organization"}</p>
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
                        <DropdownMenuItem asChild className="flex items-center gap-2">
                            <Link href="/settings/integrations">
                                <Blocks className="h-4 w-4" /> Integrations
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href="/select-org" className="flex items-center gap-2">
                                <Plus className="h-4 w-4" />
                                Create or join an organization
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
}