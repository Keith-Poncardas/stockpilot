import { InventoryHealth } from '@/components/InventoryHealth';
import type { IProductInventory } from '../../../types';

interface InventoryHealthSectionProps {
    inventory?: IProductInventory | null;
}

export function InventoryHealthSection({ inventory }: InventoryHealthSectionProps) {
    if (!inventory) {
        return (
            <section className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
                <h2 className="font-semibold text-base text-slate-800 mb-2">Inventory Health</h2>
                <p className="text-sm text-slate-400">No inventory record attached to this product.</p>
            </section>
        );
    }

    return (
        <InventoryHealth
            data={{
                onHand: inventory.quantityOnHand ?? 0,
                reorderLevel: inventory.reorderLevel ?? 0,
                maxStock: inventory.maxStock ?? 0,
                lastRestockDate: inventory.lastRestockDate ?? new Date().toISOString(),
                estimatedDaysOfStock: inventory.estimatedDaysOfStock ?? 0,
            }}
        />
    );
}

InventoryHealthSection.Skeleton = function InventoryHealthSectionSkeleton() {
    return (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs animate-pulse">
            <div className="h-5 w-32 bg-slate-200 rounded mb-4" />
            <div className="space-y-3">
                <div className="h-4 w-full bg-slate-100 rounded" />
                <div className="h-4 w-4/5 bg-slate-100 rounded" />
                <div className="h-4 w-2/3 bg-slate-100 rounded" />
            </div>
        </div>
    );
};
