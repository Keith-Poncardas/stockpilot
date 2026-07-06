import { Button } from "@/components/ui/button";
import type { IProduct } from "@/features/product/product.types";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const statusStyles: Record<string, { badge: string; dot: string }> = {
    ACTIVE: { badge: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20', dot: 'bg-emerald-400' },
    INACTIVE: { badge: 'bg-gray-500/15 text-gray-400 border-gray-500/20', dot: 'bg-gray-400' },
    DISCONTINUED: { badge: 'bg-red-500/15 text-red-400 border-red-500/20', dot: 'bg-red-400' },
    DRAFT: { badge: 'bg-amber-500/15 text-amber-400 border-amber-500/20', dot: 'bg-amber-400' },
    ARCHIVED: { badge: 'bg-slate-500/15 text-slate-400 border-slate-500/20', dot: 'bg-slate-400' },
};

type HeaderProps = Pick<IProduct, 'name' | 'sku' | 'status'>

export function Header({ name = 'Sample Product', sku = '123-4567-890', status: productStatus }: Partial<HeaderProps>) {
    const navigate = useNavigate();

    const handleBack = () => {
        navigate(-1);
    }

    return (
        <header className="bg-gray-900  text-white rounded-2xl py-3 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="glass"
                            size="icon-lg"
                            className="hidden sm:flex rounded-full"
                            onClick={handleBack}
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <div>
                            <div className="flex items-center gap-3 flex-wrap">
                                <h1 className="font-display text-xl sm:text-2xl font-semibold tracking-tight">
                                    {name}
                                </h1>
                                {productStatus && (() => {
                                    const s = statusStyles[productStatus] ?? statusStyles['INACTIVE'];
                                    return (
                                        <span className={`inline-flex items-center gap-1.5 rounded-full text-xs font-semibold px-2.5 py-1 border ${s.badge}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                                            {productStatus}
                                        </span>
                                    );
                                })()}
                            </div>
                            <p className="text-slate-400 text-sm mt-1 font-mono">
                                <span className="font-bold">{sku}</span>
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                        <Button variant="glass" className="px-3.5 py-2 font-semibold">
                            Print Barcode
                        </Button>
                        <Button variant="glass" className="px-3.5 py-2 font-semibold">
                            Adjust Stock
                        </Button>
                        <Button className="px-3.5 py-2">
                            Edit Product
                        </Button>
                    </div>
                </div>
            </div>
        </header>
    )
}
