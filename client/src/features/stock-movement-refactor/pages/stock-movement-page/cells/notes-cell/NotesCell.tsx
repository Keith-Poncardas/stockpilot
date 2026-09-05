import type { Row } from "@tanstack/react-table";
import type { IStockMovementWithRelations } from "@/features/stock-movement-refactor/types";

interface NotesCellProps {
    row: Row<IStockMovementWithRelations>;
}

export function NotesCell({ row }: NotesCellProps) {
    const notes = row.original.notes;

    if (!notes) {
        return <span className="text-slate-400 text-xs italic font-normal">—</span>;
    }

    return (
        <p
            className="text-xs text-slate-600 break-words whitespace-normal leading-relaxed max-w-[220px]"
            title={notes}
        >
            {notes}
        </p>
    );
}
