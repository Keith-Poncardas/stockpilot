import Barcode from 'react-barcode';

export interface ProductBarcodeProps {
    value: string;
}

export function ProductBarcode({ value }: ProductBarcodeProps) {
    return (
        <section className="bg-white rounded-2xl border border-[#E3E1DC] p-5 sm:p-6">
            <h2 className="font-display font-semibold text-lg mb-4">Barcode</h2>
            <div className="bg-[#F7F7F5] rounded-xl p-4 flex flex-col items-center justify-center min-h-30">
                {value ? (
                    <>
                        <div className="h-14 overflow-hidden flex items-center justify-center">
                            <Barcode
                                value={value}
                                width={1.8}
                                height={56}
                                displayValue={false}
                                background="transparent"
                                lineColor="#14171F"
                                margin={0}
                            />
                        </div>
                        <p className="font-mono text-sm tracking-[0.3em] mt-3 uppercase">{value}</p>
                    </>
                ) : (
                    <p className="text-sm text-[#9C9A91]">No barcode available</p>
                )}
            </div>
        </section>
    );
}
