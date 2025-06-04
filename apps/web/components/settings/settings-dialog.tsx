"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { motion } from "framer-motion"
import { variants } from "@/components/sidebar/framer-props";
import GeneralSettings from "./sections/general"
import NotificationsSettings from "./sections/notifications"
import PersonalizationSettings from "./sections/personalization"
import SpeechSettings from "./sections/speech"
import DataControlsSettings from "./sections/data-controls"
import BuilderProfileSettings from "./sections/builder-profile"
import ConnectedAppsSettings from "./sections/connected-apps"
import SecuritySettings from "./sections/security"
import SubscriptionSettings from "./sections/subscription"
import { useState } from "react"
import { Bell, CreditCard, Database, Lock, Mic, Palette, Settings, User, Wrench } from "lucide-react"

const settingsItems = [
    { id: "general", label: "General", icon: Settings },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "personalization", label: "Personalization", icon: User },
    { id: "speech", label: "Speech", icon: Mic },
    { id: "data-controls", label: "Data controls", icon: Database },
    { id: "builder-profile", label: "Builder profile", icon: Wrench },
    { id: "connected-apps", label: "Connected apps", icon: Palette },
    { id: "security", label: "Security", icon: Lock },
    { id: "subscription", label: "Subscription", icon: CreditCard },
]

export default function SettingsDialog({ open, setOpen }: { open: boolean; setOpen: (open: boolean) => void }) {
    const [activeSection, setActiveSection] = useState("general");

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button
                    className="mt-auto flex h-8 w-full flex-row items-center rounded-md px-2 py-1.5 transition hover:bg-muted hover:text-primary"
                    onClick={() => setOpen(true)}
                    type="button"
                >
                    <Settings className="h-4 w-4 shrink-0" />{" "}
                    <motion.li variants={variants}>
                        <p className="ml-2 text-sm font-medium"> Settings</p>
                    </motion.li>
                </button>
            </DialogTrigger>
            <DialogContent className="bg-background text-foreground rounded-2xl shadow-xl p-4 !max-w-5xl !w-[900px] min-w-[700px] [&_.group.absolute]:hidden">
                <div className="flex h-full">
                    {/* Left Sidebar */}
                    <div className="w-64 bg-background border-r border-muted p-6 overflow-y-auto flex flex-col">
                        <DialogHeader className="mb-6">
                            <DialogTitle className="text-lg font-bold mb-4 text-foreground">Settings</DialogTitle>
                        </DialogHeader>

                        <nav className="space-y-1">
                            {settingsItems.map((item) => {
                                const Icon = item.icon
                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => setActiveSection(item.id)}
                                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-base transition-colors ${activeSection === item.id
                                            ? "bg-accent text-accent-foreground"
                                            : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground"
                                            }`}
                                    >
                                        <Icon className="w-4 h-4" />
                                        {item.label}
                                    </button>
                                )
                            })}
                        </nav>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 p-6 overflow-y-auto">
                        {activeSection === "general" && <GeneralSettings />}
                        {activeSection === "notifications" && <NotificationsSettings />}
                        {activeSection === "personalization" && <PersonalizationSettings />}
                        {activeSection === "speech" && <SpeechSettings />}
                        {activeSection === "data-controls" && <DataControlsSettings />}
                        {activeSection === "builder-profile" && <BuilderProfileSettings />}
                        {activeSection === "connected-apps" && <ConnectedAppsSettings />}
                        {activeSection === "security" && <SecuritySettings />}
                        {activeSection === "subscription" && <SubscriptionSettings />}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
