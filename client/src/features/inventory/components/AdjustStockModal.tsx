import * as React from 'react'
import { useMutation } from '@apollo/client'
import { Loader2, AlertTriangle, TrendingUp, TrendingDown, RotateCcw } from 'lucide-react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ADJUST_STOCK, GET_INVENTORY_STATUSES, GET_INVENTORIES } from '../operations'
import type { IInventory } from '../inventory.types'

interface AdjustStockModalProps {
    open: boolean
    onClose: () => void
    inventory: IInventory | null
}

type MovementType = 'IN' | 'OUT' | 'ADJUSTMENT'

const MOVEMENT_OPTIONS: { value: MovementType; label: string; icon: React.ReactNode; description: string; colorClass: string }[] = [
    {
        value: 'IN',
        label: 'Stock In',
        icon: <TrendingUp size={16} />,
        description: 'Add units to inventory (restock, returns)',
        colorClass: 'border-emerald-300 bg-emerald-50 text-emerald-700',
    },
    {
        value: 'OUT',
        label: 'Stock Out',
        icon: <TrendingDown size={16} />,
        description: 'Remove units from inventory (damage, loss)',
        colorClass: 'border-red-300 bg-red-50 text-red-700',
    },
    {
        value: 'ADJUSTMENT',
        label: 'Adjustment',
        icon: <RotateCcw size={16} />,
        description: 'Set exact quantity (cycle count)',
        colorClass: 'border-amber-300 bg-amber-50 text-amber-700',
    },
]

export function AdjustStockModal({ open, onClose, inventory }: AdjustStockModalProps) {
    const [movementType, setMovementType] = React.useState<MovementType>('IN')
    const [quantity, setQuantity] = React.useState('')
    const [reorderLevel, setReorderLevel] = React.useState('')
    const [maxStock, setMaxStock] = React.useState('')
    const [reference, setReference] = React.useState('')
    const [notes, setNotes] = React.useState('')
    const [error, setError] = React.useState('')

    const [adjustStock, { loading }] = useMutation(ADJUST_STOCK, {
        refetchQueries: [
            { query: GET_INVENTORY_STATUSES },
            GET_INVENTORIES,
        ],
        onCompleted: () => {
            handleClose()
        },
        onError: (err) => {
            setError(err.message || 'Failed to adjust stock. Please try again.')
        }
    })

    React.useEffect(() => {
        if (open && inventory) {
            setReorderLevel(String(inventory.reorderLevel))
            setMaxStock('')
            setQuantity('')
            setReference('')
            setNotes('')
            setMovementType('IN')
            setError('')
        }
    }, [open, inventory])

    function handleClose() {
        onClose()
        setError('')
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError('')

        const qty = parseInt(quantity, 10)
        if (!quantity || isNaN(qty) || qty < 0) {
            setError('Please enter a valid non-negative quantity.')
            return
        }

        const rl = parseInt(reorderLevel, 10)
        if (isNaN(rl) || rl < 0) {
            setError('Please enter a valid non-negative reorder level.')
            return
        }

        const ms = parseInt(maxStock, 10) || 0
        if (isNaN(ms) || ms < 0) {
            setError('Please enter a valid non-negative max stock value.')
            return
        }

        adjustStock({
            variables: {
                input: {
                    inventoryId: inventory!.id,
                    movementType,
                    quantity: qty,
                    reorderLevel: rl,
                    maxStock: ms,
                    reference: reference || undefined,
                    notes: notes || undefined,
                }
            }
        })
    }

    if (!inventory) return null

    return (
        <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
            <DialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden">
                <DialogHeader className="px-5 pt-5 pb-4 border-b border-gray-100">
                    <DialogTitle className="text-base font-bold text-gray-900">
                        Adjust Stock
                    </DialogTitle>
                    <div className="mt-1">
                        <p className="text-sm font-semibold text-gray-700">{inventory.product.name}</p>
                        <p className="text-xs text-gray-400 font-mono mt-0.5">{inventory.product.sku}</p>
                        <div className="flex items-center gap-3 mt-2">
                            <span className="text-xs text-gray-500">
                                Current stock: <span className="font-bold text-gray-900 font-mono">{inventory.quantityOnHand}</span>
                            </span>
                            <span className="text-xs text-gray-400">·</span>
                            <span className="text-xs text-gray-500">
                                Reorder level: <span className="font-bold text-gray-900 font-mono">{inventory.reorderLevel}</span>
                            </span>
                        </div>
                    </div>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="px-5 py-4 space-y-4">
                    {/* Movement Type Selection */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                            Movement Type
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                            {MOVEMENT_OPTIONS.map(opt => (
                                <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => setMovementType(opt.value)}
                                    className={cn(
                                        'flex flex-col items-center gap-1.5 p-2.5 rounded-lg border-2 text-center transition-all cursor-pointer',
                                        movementType === opt.value
                                            ? opt.colorClass + ' border-current'
                                            : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:bg-gray-50'
                                    )}
                                >
                                    <span>{opt.icon}</span>
                                    <span className="text-xs font-bold leading-tight">{opt.label}</span>
                                </button>
                            ))}
                        </div>
                        <p className="text-xs text-gray-400 mt-1.5">
                            {MOVEMENT_OPTIONS.find(o => o.value === movementType)?.description}
                        </p>
                    </div>

                    {/* Quantity */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                                Quantity <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                min={0}
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                                placeholder="0"
                                className="w-full h-9 rounded-md border border-slate-200 px-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-400"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                                Reorder Level <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                min={0}
                                value={reorderLevel}
                                onChange={(e) => setReorderLevel(e.target.value)}
                                placeholder="0"
                                className="w-full h-9 rounded-md border border-slate-200 px-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-400"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                            Max Stock <span className="text-xs text-gray-400 font-normal">(optional)</span>
                        </label>
                        <input
                            type="number"
                            min={0}
                            value={maxStock}
                            onChange={(e) => setMaxStock(e.target.value)}
                            placeholder="0"
                            className="w-full h-9 rounded-md border border-slate-200 px-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-400"
                        />
                    </div>

                    {/* Reference & Notes */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Reference</label>
                            <input
                                type="text"
                                value={reference}
                                onChange={(e) => setReference(e.target.value)}
                                placeholder="e.g. PO-2025-001"
                                className="w-full h-9 rounded-md border border-slate-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-400"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Notes</label>
                            <input
                                type="text"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Optional note"
                                className="w-full h-9 rounded-md border border-slate-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-400"
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="flex items-start gap-2 rounded-lg bg-red-50 border border-red-200 px-3 py-2.5">
                            <AlertTriangle size={14} className="text-red-500 shrink-0 mt-0.5" />
                            <p className="text-xs text-red-600 font-medium">{error}</p>
                        </div>
                    )}
                </form>

                <DialogFooter className="px-5 pb-5 pt-0 border-t-0 bg-transparent flex-row justify-end gap-2 rounded-none">
                    <Button type="button" variant="outline" size="sm" onClick={handleClose} disabled={loading}>
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        size="sm"
                        disabled={loading}
                        onClick={handleSubmit as any}
                    >
                        {loading && <Loader2 size={14} className="mr-1.5 animate-spin" />}
                        Confirm Adjustment
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
