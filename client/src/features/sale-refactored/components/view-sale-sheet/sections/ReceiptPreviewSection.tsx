import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { Printer } from "lucide-react";
import Barcode from "react-barcode";
import { FormSection } from "@/components/ui/form-section";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { ISaleDetails } from "../../../types";

export interface ReceiptPreviewSectionProps {
    sale: ISaleDetails;
}

export function ReceiptPreviewSection({ sale }: ReceiptPreviewSectionProps) {
    const contentRef = useRef<HTMLDivElement>(null);

    const handlePrint = useReactToPrint({
        contentRef,
        documentTitle: `Receipt-${sale.id?.slice(0, 8).toUpperCase() || "SALE"}`,
    });

    const shortId = sale.id?.slice(0, 8).toUpperCase() || "N/A";
    const totalItemsCount = sale.saleItems?.reduce((sum, item) => sum + item.quantity, 0) || 0;
    const customerName = sale.customer
        ? `${sale.customer.firstName ?? ""} ${sale.customer.lastName ?? ""}`.trim() || "Customer"
        : "Walk-in Customer";
    const cashierName = `${sale.author?.firstName ?? ""} ${sale.author?.lastName ?? ""}`.trim() || "Cashier";

    return (
        <FormSection
            title="Receipt Preview"
            description="80mm thermal paper format preview ready for POS printing."
            icon={<Printer className="w-4.5 h-4.5" strokeWidth={2} />}
            iconWrapperClassName="bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400"
            actions={
                <Button
                    onClick={() => handlePrint()}
                    size="sm"
                    variant="outline"
                    className="gap-2 font-medium"
                >
                    <Printer className="w-4 h-4" />
                    Print Receipt
                </Button>
            }
        >
            <style>{`
                @media print {
                    @page {
                        size: 80mm auto;
                        margin: 0mm;
                    }
                    body {
                        background: white !important;
                        color: black !important;
                        margin: 0 !important;
                        padding: 4mm !important;
                        -webkit-print-color-adjust: exact;
                    }
                }
            `}</style>

            <div className="flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-200/80 dark:border-slate-800">
                <div
                    ref={contentRef}
                    className="w-[320px] bg-white text-black p-6 font-mono text-xs shadow-md rounded-sm border border-slate-200 print:shadow-none print:border-none print:w-full print:p-0"
                >
                    {/* Store Header */}
                    <div className="text-center pb-3 border-b border-dashed border-gray-400">
                        <p className="font-bold text-base tracking-wider">STOCKPILOT POS</p>
                        <p className="text-[10px] text-gray-600 mt-0.5">MAIN BRANCH • STORE #01</p>
                        <p className="text-[10px] text-gray-600">VAT REG TIN: 000-123-456-000</p>
                    </div>

                    {/* Transaction Meta */}
                    <div className="py-3 border-b border-dashed border-gray-400 space-y-1 text-[11px]">
                        <div className="flex justify-between">
                            <span className="text-gray-600">RECEIPT NO:</span>
                            <span className="font-semibold">#{shortId}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">DATE:</span>
                            <span>{formatDate(sale.saleDate)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">CASHIER:</span>
                            <span>{cashierName}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">CUSTOMER:</span>
                            <span className="truncate max-w-37.5">{customerName}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">PAYMENT:</span>
                            <span className="font-semibold uppercase">
                                {sale.paymentMethod || "CASH"}
                            </span>
                        </div>
                    </div>

                    {/* Line Items */}
                    <div className="py-3 border-b border-dashed border-gray-400">
                        <div className="flex justify-between font-semibold text-[11px] mb-2 border-b border-gray-300 pb-1">
                            <span>ITEM / QTY</span>
                            <span>AMOUNT</span>
                        </div>
                        <div className="space-y-2.5">
                            {sale.saleItems?.map((item) => (
                                <div key={item.id} className="text-[11px]">
                                    <div className="font-medium text-black truncate">
                                        {item.product.name}
                                    </div>
                                    <div className="flex justify-between text-gray-700 mt-0.5">
                                        <span>
                                            {item.quantity} x {formatCurrency(item.unitPrice)}
                                        </span>
                                        <span className="font-semibold text-black">
                                            {formatCurrency(item.quantity * item.unitPrice)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Totals Section */}
                    <div className="py-3 border-b border-dashed border-gray-400 space-y-1.5 text-[11px]">
                        <div className="flex justify-between text-gray-700">
                            <span>TOTAL ITEMS:</span>
                            <span>{totalItemsCount}</span>
                        </div>
                        <div className="flex justify-between text-gray-700">
                            <span>SUBTOTAL:</span>
                            <span>{formatCurrency(sale.totalAmount)}</span>
                        </div>
                        <div className="flex justify-between font-bold text-sm text-black pt-1.5 border-t border-gray-200">
                            <span>TOTAL DUE:</span>
                            <span>{formatCurrency(sale.totalAmount)}</span>
                        </div>
                        <div className="flex justify-between text-gray-700">
                            <span>PAID AMOUNT:</span>
                            <span>{formatCurrency(sale.totalAmount)}</span>
                        </div>
                    </div>

                    {/* Barcode & Footer */}
                    <div className="pt-4 text-center flex flex-col items-center">
                        <div className="mb-2 overflow-hidden flex items-center justify-center">
                            <Barcode
                                value={shortId}
                                width={1.4}
                                height={38}
                                displayValue={false}
                                background="transparent"
                                lineColor="#000000"
                                margin={0}
                            />
                        </div>
                        <p className="font-mono text-[10px] tracking-[0.25em] uppercase mb-2">
                            {shortId}
                        </p>
                        <p className="text-[11px] font-semibold">THANK YOU FOR YOUR PURCHASE!</p>
                        <p className="text-[9px] text-gray-500 mt-0.5">
                            Please keep this receipt for your records
                        </p>
                    </div>
                </div>
            </div>
        </FormSection>
    );
}
