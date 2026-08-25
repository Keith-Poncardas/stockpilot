import type { LucideIcon } from "lucide-react";

/**
 * Represents an action configuration option for a cell menu.
 */
export interface ActionOption {
    label: string;
    icon: LucideIcon;
    onClick: () => void;
}