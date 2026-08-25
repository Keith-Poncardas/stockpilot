import type { LucideIcon } from "lucide-react";

export interface ActionOption {
    label: string;
    icon: LucideIcon;
    onClick: () => void;
}
