import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ExternalLink, Layers, ZoomIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getOptimizedImageUrl } from '@/lib/cloudinary';

interface ProductImageLightboxDialogProps {
    isOpen: boolean;
    onClose: () => void;
    imageUrl?: string | null;
    productName: string;
    sku?: string | null;
    isBundle?: boolean;
}

export function ProductImageLightboxDialog({
    isOpen,
    onClose,
    imageUrl,
    productName,
    sku,
    isBundle = false,
}: ProductImageLightboxDialogProps) {
    if (!imageUrl) return null;

    // High resolution view for lightbox (1600px width limit, auto format & quality)
    const fullSizeUrl = getOptimizedImageUrl(imageUrl, {
        width: 1600,
        height: 1600,
        crop: 'limit',
        quality: 'auto',
    });

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-3xl! p-0 overflow-hidden bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-2xl rounded-2xl">
                {/* Header */}
                <DialogHeader className="px-6 pt-5 pb-3 border-b border-slate-100 flex flex-row items-center justify-between gap-4">
                    <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                            <DialogTitle className="text-base font-bold text-slate-900 truncate">
                                {productName}
                            </DialogTitle>
                            {isBundle && (
                                <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 text-[10px] font-bold">
                                    <Layers className="w-2.5 h-2.5 mr-1 text-purple-600" />
                                    Bundle
                                </Badge>
                            )}
                        </div>
                        {sku && (
                            <DialogDescription className="text-xs font-mono text-slate-500 mt-0.5">
                                SKU: {sku}
                            </DialogDescription>
                        )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0 pr-8">
                        <Button
                            variant="outline"
                            size="sm"
                            asChild
                            className="h-8 text-xs font-medium gap-1.5"
                        >
                            <a href={imageUrl} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="w-3.5 h-3.5" />
                                Open Original
                            </a>
                        </Button>
                    </div>
                </DialogHeader>

                {/* Lightbox Image Container */}
                <div className="relative w-full min-h-[320px] max-h-[75vh] bg-slate-950/5 flex items-center justify-center p-4 sm:p-8 overflow-hidden select-none">
                    <img
                        src={fullSizeUrl}
                        alt={productName}
                        className="max-h-[65vh] max-w-full object-contain rounded-lg shadow-md transition-transform duration-200 hover:scale-[1.02]"
                    />
                </div>

                {/* Footer Tip */}
                <div className="px-6 py-2.5 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center gap-1.5">
                        <ZoomIn className="w-3.5 h-3.5 text-slate-400" />
                        Cloudinary Auto-Optimized High Resolution View
                    </span>
                    <span className="font-mono text-[11px] text-slate-400">
                        StockPilot Media
                    </span>
                </div>
            </DialogContent>
        </Dialog>
    );
}
