import type { Row } from "@tanstack/react-table";
import { UserInfoCell } from "@/components/UserInfoCell";
import type { IStockMovementWithRelations } from "@/features/stock-movement-refactor/types";

interface RecordedByCellProps {
    row: Row<IStockMovementWithRelations>;
}

export function RecordedByCell({ row }: RecordedByCellProps) {
    const author = row.original.author;

    return (
        <UserInfoCell
            user={author}
            avatarClassName="w-8 h-8 shadow-2xs border border-slate-200"
        />
    );
}
