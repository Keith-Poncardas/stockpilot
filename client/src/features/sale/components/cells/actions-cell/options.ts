import { Eye, Receipt } from "lucide-react";
import type { ActionOption } from "./types";

/**
 * Generates the list of action options for the ActionsCell component.
 *
 * @param {() => void} onView - Callback function invoked when the "View Sale" action is clicked.
 * @param {() => void} onDownloadReceipt - Callback function invoked when the "Download Receipt" action is clicked.
 * @returns {ActionOption[]} An array of configured actions.
 */
export const getActionOptions = (
    onView: () => void,
    onDownloadReceipt: () => void
): ActionOption[] => [
        {
            label: "View Sale",
            icon: Eye,
            onClick: onView,
        },
        {
            label: "Download Receipt",
            icon: Receipt,
            onClick: onDownloadReceipt,
        },
    ];
