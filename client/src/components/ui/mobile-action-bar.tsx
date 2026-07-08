import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import type React from 'react';

interface MobileActionBarProps {
    children: ReactNode;
}

/**
 * A fixed bottom action bar visible only on mobile (hidden on sm+).
 * Pair with `hidden sm:flex` on the Header's actions to avoid duplication.
 *
 * @example
 * <MobileActionBar>
 *   <MobileActionBar.Secondary type="button" onClick={handleCancel}>Cancel</MobileActionBar.Secondary>
 *   <MobileActionBar.Primary type="submit" form="product-form">Save</MobileActionBar.Primary>
 * </MobileActionBar>
 */
export function MobileActionBar({ children }: MobileActionBarProps) {
    return (
        <div className="sm:hidden fixed bottom-0 inset-x-0 z-30 bg-white border-t border-slate-200 px-4 py-3 flex items-center gap-3">
            {children}
        </div>
    );
}

type ButtonProps = React.ComponentProps<typeof Button>;

/** Secondary/ghost action (e.g. Cancel). Takes flex-1. */
MobileActionBar.Secondary = function MobileActionBarSecondary({
    className = '',
    size = 'lg',
    variant = 'outline',
    ...props
}: ButtonProps) {
    return (
        <Button
            variant={variant}
            size={size}
            className={`flex-1 h-auto py-3 ${className}`}
            {...props}
        />
    );
};

/** Primary action (e.g. Save). Takes flex-[2]. */
MobileActionBar.Primary = function MobileActionBarPrimary({
    className = '',
    size = 'lg',
    variant = 'default',
    ...props
}: ButtonProps) {
    return (
        <Button
            variant={variant}
            size={size}
            className={`flex-2 h-auto py-3 ${className}`}
            {...props}
        />
    );
};

/** Equal-weight action for multi-button bars (e.g. ProductViewPage). Takes flex-1. */
MobileActionBar.Action = function MobileActionBarAction({
    className = '',
    size = 'lg',
    variant = 'outline',
    ...props
}: ButtonProps) {
    return (
        <Button
            variant={variant}
            size={size}
            className={`flex-1 h-auto py-3 ${className}`}
            {...props}
        />
    );
};
