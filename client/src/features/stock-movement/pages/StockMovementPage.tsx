import SectionHeader from "@/components/SectionHeader";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Plus } from "lucide-react";

export function StockMovementPage() {
    return (
        <>
            <SectionHeader
                title="Stock Movements"
                subtitle="Manage and track all stock adjustments in your warehouse."
                icon={ArrowUpDown}
                actions={
                    <Button size="lg">
                        <Plus data-icon="inline-start" />
                        Record Movement
                    </Button>
                }
            />
        </>
    )
}