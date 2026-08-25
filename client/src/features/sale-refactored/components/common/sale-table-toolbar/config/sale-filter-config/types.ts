import React from 'react';

/**
 * Configuration properties representing a single filter popover element.
 */
export interface PopoverConfigItem {
    title: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    contentClassName: string;
    children: React.ReactNode;
};
