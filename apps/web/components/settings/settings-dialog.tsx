"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { motion } from "framer-motion"
import GeneralSettings from "./sections/general"
import NotificationsSettings from "./sections/notifications"
import PersonalizationSettings from "./sections/personalization"
import SpeechSettings from "./sections/speech"
import DataControlsSettings from "./sections/data-controls"
import BuilderProfileSettings from "./sections/builder-profile"
import ConnectedAppsSettings from "./sections/connected-apps"
import SecuritySettings from "./sections/security"
import SubscriptionSettings from "./sections/subscription"
import { useState, useEffect } from "react"
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

export default function SettingsDialog({ section, children }: { section?: string; children: React.ReactNode }) {
    const [activeSection, setActiveSection] = useState(section || "general");
    const [open, setOpen] = useState(false);

    // When dialog is opened, update URL hash to #settings
    useEffect(() => {
        if (open) {
            window.location.hash = '#settings';
        } else if (window.location.hash === '#settings') {
            history.replaceState(null, '', window.location.pathname + window.location.search);
        }
    }, [open]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="bg-transparent border-transparent text-foreground p-1 !max-w-5xl !w-[900px] min-w-[700px] [&_.group.absolute]:hidden">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.18, ease: "easeInOut" }}
                    className="flex h-full rounded-2xl border border-white/15 backdrop-blur-2xl"
                    style={{ background: "rgba(36,37,46,0.38)" }}
                >
                    {/* Left Sidebar */}
                    <div className="w-64 border-r border-white/10 p-6 overflow-y-auto flex flex-col">
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
                </motion.div>
            </DialogContent>
        </Dialog>
    )
}
