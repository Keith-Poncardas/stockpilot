import { Plus, PenSquare, MoreHorizontal } from 'lucide-react';

/**
 * Configuration array for the action buttons displayed in the User Profile Header.
 * 
 * Extracts button rendering logic and properties outside of the component 
 * to prevent unnecessary recreation during re-renders.
 */
export const USER_ACTION_BUTTONS = [
    {
        label: 'Edit User',
        Icon: Plus,
        iconProps: { size: 18 },
        props: {
            className: 'gap-2 font-semibold px-4 h-9',
        }
    },
    {
        label: 'Update Role',
        Icon: PenSquare,
        iconProps: { size: 18, className: "text-gray-500" },
        props: {
            variant: 'outline' as const,
            className: 'gap-2 font-semibold px-4 h-9 border-gray-200 text-gray-700',
        }
    },
    {
        label: null,
        Icon: MoreHorizontal,
        iconProps: { size: 20 },
        props: {
            variant: 'outline' as const,
            size: 'icon' as const,
            className: 'h-9 w-12 border-gray-200 text-gray-700',
        }
    }
];
