import Barcode from 'react-barcode';
import { Barcode as BarcodeIcon } from 'lucide-react';
import { FormSection } from '@/components/ui/form-section';

export interface ProductBarcodeSectionProps {
    value?: string | null;
    className?: string;
}

export function ProductBarcodeSection({ value, className }: ProductBarcodeSectionProps) {
    return (
        <FormSection
            title="Barcode"
            description="Scannable barcode generated from SKU"
            icon={<BarcodeIcon className="w-4.5 h-4.5" strokeWidth={2} />}
            iconWrapperClassName="bg-slate-100 text-slate-700"
            className={className}
        >
            <div className="bg-slate-50 rounded-xl p-4 flex flex-col items-center justify-center min-h-30 border border-slate-100">
                {value ? (
                    <>
                        <div className="h-14 overflow-hidden flex items-center justify-center">
                            <Barcode
                                value={value}
                                width={1.8}
                                height={56}
                                displayValue={false}
                                background="transparent"
                                lineColor="#1e293b"
                                margin={0}
                            />
                        </div>
                        <p className="font-mono text-xs tracking-[0.25em] mt-3 uppercase text-slate-600 font-semibold">
                            {value}
                        </p>
                    </>
                ) : (
                    <p className="text-sm text-slate-400">No barcode available</p>
                )}
            </div>
        </FormSection>
    );
}

ProductBarcodeSection.Skeleton = function ProductBarcodeSectionSkeleton() {
    return (
        <FormSection
            title="Barcode"
            description="Loading barcode..."
            icon={<BarcodeIcon className="w-4.5 h-4.5" strokeWidth={2} />}
            iconWrapperClassName="bg-slate-100 text-slate-700"
            className="animate-pulse"
        >
            <div className="bg-slate-50 rounded-xl p-4 flex flex-col items-center justify-center min-h-30 border border-slate-100">
                <div className="h-14 w-44 bg-slate-200 rounded" />
                <div className="h-4 w-28 bg-slate-100 rounded mt-3" />
            </div>
        </FormSection>
    );
};

