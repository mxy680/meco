import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ModelOption } from "./chat";
import { Check, ChevronDown } from "lucide-react";

// Model Selector Component
const ModelSelectorDropdown: React.FC<{
    models: ModelOption[];
    selectedModel: string;
    onModelChange: (modelId: string) => void;
}> = ({ models, selectedModel, onModelChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectedModelData =
        models.find((m) => m.id === selectedModel) || models[0];
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <Button
                variant="ghost"
                size="sm"
                className="h-9 px-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="truncate max-w-[150px] sm:max-w-[200px]">
                    {selectedModelData.name}
                </span>
                <ChevronDown
                    className={cn(
                        "ml-1 h-4 w-4 transition-transform text-muted-foreground group-hover:text-foreground",
                        isOpen && "rotate-180"
                    )}
                />
            </Button>

            {isOpen && (
                <div className="absolute bottom-full right-0 mb-2 w-72 bg-background/90 border border-border rounded-lg shadow-xl z-20 p-2">
                    {models.map((model) => (
                        <button
                            key={model.id}
                            className={cn(
                                "w-full text-left p-2.5 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors flex items-center justify-between",
                                model.id === selectedModel && "bg-muted/70"
                            )}
                            onClick={() => {
                                onModelChange(model.id);
                                setIsOpen(false);
                            }}
                        >
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="font-medium text-foreground">
                                        {model.name}
                                    </span>
                                    {model.badge && (
                                        <span className="px-1.5 py-0.5 text-xs bg-blue-600/10 text-blue-600/80 rounded">
                                            {model.badge}
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                    {model.description}
                                </p>
                            </div>
                            {model.id === selectedModel && (
                                <Check className="h-4 w-4 text-primary flex-shrink-0" />
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ModelSelectorDropdown;