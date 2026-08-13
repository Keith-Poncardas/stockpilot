import type { Table as TableType } from "@tanstack/react-table"
import { flexRender } from "@tanstack/react-table"
import { cn } from "@/lib/utils"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface DataTableProps<TData> {
  table: TableType<TData>
  isLoading?: boolean
}

// Fixed pixel widths — never shrink below a readable size on mobile/tablet.
// Max-width keeps them proportional on wide columns.
const SKELETON_WIDTH_PATTERNS = [
  [{ min: 80, max: 140 }, { min: 56, max: 100 }, { min: 72, max: 120 }, { min: 48, max: 88 }, { min: 64, max: 110 }],
  [{ min: 56, max: 100 }, { min: 72, max: 130 }, { min: 56, max: 96 }, { min: 80, max: 140 }, { min: 48, max: 80 }],
  [{ min: 72, max: 120 }, { min: 48, max: 80 }, { min: 80, max: 140 }, { min: 56, max: 100 }, { min: 64, max: 112 }],
  [{ min: 56, max: 96 }, { min: 80, max: 140 }, { min: 48, max: 84 }, { min: 72, max: 120 }, { min: 56, max: 96 }],
  [{ min: 80, max: 140 }, { min: 56, max: 96 }, { min: 48, max: 80 }, { min: 80, max: 140 }, { min: 72, max: 120 }],
  [{ min: 48, max: 80 }, { min: 72, max: 120 }, { min: 56, max: 96 }, { min: 80, max: 140 }, { min: 56, max: 96 }],
  [{ min: 72, max: 120 }, { min: 56, max: 96 }, { min: 80, max: 140 }, { min: 48, max: 80 }, { min: 48, max: 84 }],
  [{ min: 56, max: 96 }, { min: 80, max: 140 }, { min: 72, max: 120 }, { min: 56, max: 96 }, { min: 80, max: 140 }],
] as const

function SkeletonCell({
  size,
  rowIndex,
  cellIndex,
}: {
  size: { min: number; max: number }
  rowIndex: number
  cellIndex: number
}) {
  const delay = `${(rowIndex * 0.06 + cellIndex * 0.04).toFixed(2)}s`

  return (
    <TableCell className="px-4 py-3.5">
      <div
        className="relative overflow-hidden rounded-full bg-gray-100 dark:bg-zinc-800"
        style={{
          height: "14px",
          minWidth: `${size.min}px`,
          maxWidth: `${size.max}px`,
          width: "100%",
        }}
      >
        <span
          className="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_ease-in-out_infinite]"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.55) 50%, transparent 100%)",
            animationDelay: delay,
          }}
        />
      </div>
    </TableCell>
  )
}

const shimmerStyle = (
  <style>{`
    @keyframes shimmer {
      0%   { transform: translateX(-100%); }
      100% { transform: translateX(200%); }
    }
  `}</style>
);

export function DataTable<TData>({ table, isLoading }: DataTableProps<TData>) {
  const columnCount = table.getAllColumns().length
  const rows = table.getRowModel().rows

  return (
    <>
      {shimmerStyle}

      <div className="overflow-hidden border-b border-gray-100 dark:border-zinc-800">
        <Table>
          <TableHeader className="bg-gray-50 dark:bg-zinc-900">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="border-b border-gray-100 hover:bg-transparent dark:border-zinc-800"
              >
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="h-10 px-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-zinc-400"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {isLoading ? (
              SKELETON_WIDTH_PATTERNS.map((pattern, rowIndex) => (
                <TableRow
                  key={rowIndex}
                  className="border-b border-gray-100/70 hover:bg-transparent dark:border-zinc-800/70"
                  style={{ opacity: Math.max(0.35, 1 - rowIndex * 0.08) }}
                >
                  {Array.from({ length: columnCount }).map((_, cellIndex) => (
                    <SkeletonCell
                      key={cellIndex}
                      size={pattern[cellIndex % pattern.length]}
                      rowIndex={rowIndex}
                      cellIndex={cellIndex}
                    />
                  ))}
                </TableRow>
              ))
            ) : rows?.length ? (
              rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="border-b border-gray-100 hover:bg-gray-50/50 dark:border-zinc-800 dark:hover:bg-zinc-900/50 data-[state=selected]:bg-amber-50/20"
                >
                  {row.getVisibleCells().map((cell) => {
                    const meta = cell.column.columnDef.meta as any;
                    const cellClass = typeof meta?.cellClassName === 'function'
                      ? meta.cellClassName(row.original)
                      : meta?.cellClassName;

                    return (
                      <TableCell
                        key={cell.id}
                        className={cn("px-4 py-3 text-sm text-gray-700 dark:text-zinc-300", cellClass)}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    )
                  })}
                </TableRow>
              ))
            ) : null}
          </TableBody>
        </Table>
      </div>
    </>
  )
}