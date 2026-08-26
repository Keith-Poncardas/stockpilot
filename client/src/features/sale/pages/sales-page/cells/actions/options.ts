import { Eye } from "lucide-react";
import type { ActionOption } from "./types";

/**
 * Generates the list of action options for the ActionsCell component.
 */
export const getActionOptions = (
    onView: () => void
): ActionOption[] => [
        {
            label: "View Sale",
            icon: Eye,
            onClick: onView,
        },
    ];
