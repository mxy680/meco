"use client";
import { BarChart2, TrendingUp, ScatterChart, LayoutGrid } from "lucide-react";

interface CommandSuggestion {
    icon: React.ReactNode;
    label: string;
    description: string;
    prefix: string;
}

const suggestions: CommandSuggestion[] = [
    {
        icon: <BarChart2 className="w-4 h-4" />,
        label: "Classification",
        description: "Categorize data into classes",
        prefix: "/classification"
    },
    {
        icon: <TrendingUp className="w-4 h-4" />,
        label: "Regression",
        description: "Predict continuous values",
        prefix: "/regression"
    },
    {
        icon: <ScatterChart className="w-4 h-4" />,
        label: "Clustering",
        description: "Group data by similarity",
        prefix: "/clustering"
    },
    {
        icon: <LayoutGrid className="w-4 h-4" />,
        label: "Segmentation",
        description: "Partition data or images",
        prefix: "/segmentation"
    },
];

export function ChatSuggestions() {
    return (
        <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
            {suggestions.map((suggestion) => (
                <div
                    key={suggestion.prefix}
                    className="flex items-center gap-2 px-4 py-2 bg-white/[0.03] rounded-lg text-sm text-white/80 border border-white/[0.05] shadow-sm"
                >
                    {suggestion.icon}
                    <span>{suggestion.label}</span>
                </div>
            ))}
        </div>
    );
}
