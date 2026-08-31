import Barcode from 'react-barcode';

export interface ProductBarcodeSectionProps {
    value?: string | null;
}

export function ProductBarcodeSection({ value }: ProductBarcodeSectionProps) {
    return (
        <section className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs">
            <h2 className="font-semibold text-base text-slate-800 mb-4">Barcode</h2>
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
        </section>
    );
}

ProductBarcodeSection.Skeleton = function ProductBarcodeSectionSkeleton() {
    return (
        <section className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs animate-pulse">
            <div className="h-5 w-24 bg-slate-200 rounded mb-4" />
            <div className="bg-slate-50 rounded-xl p-4 flex flex-col items-center justify-center min-h-30 border border-slate-100">
                <div className="h-14 w-44 bg-slate-200 rounded" />
                <div className="h-4 w-28 bg-slate-100 rounded mt-3" />
            </div>
        </section>
    );
};
