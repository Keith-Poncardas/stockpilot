import { DollarSign, PhilippinePeso } from 'lucide-react';
import { useWatch, type Control } from 'react-hook-form';
import { FormField } from '@/components/ui/form-field';
import { FormSection } from '@/components/ui/form-section';
import { useEstimatedMargin } from '../hooks/use-estimated-margin';
import type { ProductFormValues } from '../../../validation';

interface PricingSectionProps {
    control: Control<ProductFormValues>;
}

export function PricingSection({ control }: PricingSectionProps) {
    const unitPrice = useWatch({ control, name: 'unitPrice' });
    const costPrice = useWatch({ control, name: 'costPrice' });
    const regularPrice = useWatch({ control, name: 'regularPrice' });
    const productType = useWatch({ control, name: 'productType' });

    const isBundle = productType === 'BUNDLE';

    const { margin, profit } = useEstimatedMargin(
        unitPrice as number | string | undefined,
        costPrice as number | string | undefined
    );

    const marginDisplay = margin !== null ? `${margin.toFixed(1)}%` : '—';
    const profitDisplay = profit !== null ? `₱${profit.toFixed(2)}` : '';

    const numUnit = Number(unitPrice) || 0;
    const numRegular = Number(regularPrice) || 0;
    const savings = numRegular > numUnit ? numRegular - numUnit : 0;
    const discountPercent = numRegular > 0 && numRegular > numUnit
        ? ((numRegular - numUnit) / numRegular) * 100
        : 0;

    return (
        <FormSection
            title={isBundle ? 'Bundle Pricing & Discounts' : 'Pricing & Discounts'}
            description={
                isBundle
                    ? 'Set the special bundle package price (VAT-inclusive) and regular individual sum for discount comparison.'
                    : 'What customers pay (12% VAT-inclusive), regular original price, and your cost'
            }
            icon={<DollarSign className="w-4.5 h-4.5" strokeWidth={2} />}
            iconWrapperClassName="bg-amber-50 text-amber-700"
        >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                    <FormField
                        name="unitPrice"
                        control={control}
                        label={
                            isBundle
                                ? 'Special Bundle SRP (VAT-Inc)'
                                : numRegular > 0
                                    ? 'Discounted SRP (VAT-Inc)'
                                    : 'SRP / Selling Price (VAT-Inc)'
                        }
                        type="number"
                        placeholder="0.00"
                        required
                        min={0}
                        step="0.01"
                        icon={<PhilippinePeso className="w-4 h-4 text-slate-400" />}
                    />
                </div>

                <div>
                    <FormField
                        name="regularPrice"
                        control={control}
                        disabled={isBundle}
                        label={
                            isBundle ? (
                                <div className="flex items-center justify-between w-full gap-2">
                                    <span>Regular Price (Sum of items)</span>
                                    <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded border border-purple-200">
                                        AUTO-COMPUTED
                                    </span>
                                </div>
                            ) : (
                                <>
                                    Regular / Original Price <span className="text-slate-400 font-normal">(Optional for sale discount)</span>
                                </>
                            )
                        }
                        type="number"
                        placeholder={isBundle ? '0.00 (Calculated from components below)' : '0.00'}
                        min={0}
                        step="0.01"
                        icon={<PhilippinePeso className="w-4 h-4 text-slate-400" />}
                    />
                </div>

                <div>
                    <FormField
                        name="costPrice"
                        control={control}
                        label={
                            isBundle ? (
                                <div className="flex items-center justify-between w-full gap-2">
                                    <span>Combined Cost Price</span>
                                    <span className="text-[10px] font-medium text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded text-[10px]">
                                        AUTO-CALCULATED
                                    </span>
                                </div>
                            ) : (
                                <>
                                    Cost Price <span className="text-slate-400 font-normal">(optional)</span>
                                </>
                            )
                        }
                        type="number"
                        placeholder="0.00"
                        min={0}
                        step="0.01"
                        icon={<PhilippinePeso className="w-4 h-4 text-slate-400" />}
                    />
                </div>

                <div className="flex items-center justify-between gap-4 rounded-lg bg-slate-50 border border-slate-200 px-4 py-3 self-end h-[42px] mb-[2px]">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                        Estimated margin
                    </span>
                    <span className="font-mono text-sm font-semibold text-slate-600">
                        {marginDisplay}
                        {profitDisplay && (
                            <span className="text-slate-400 font-normal ml-2">
                                ({profitDisplay} profit)
                            </span>
                        )}
                    </span>
                </div>

                {savings > 0 && (
                    <div className="sm:col-span-2 flex items-center justify-between gap-3 rounded-lg bg-emerald-50 border border-emerald-200 px-4 py-3">
                        <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wide">
                            {isBundle ? 'Bundle Savings & Discount' : 'Promotional Sale Discount'}
                        </span>
                        <span className="font-mono text-sm font-bold text-emerald-700">
                            Save ₱{savings.toFixed(2)} ({discountPercent.toFixed(1)}% OFF)
                        </span>
                    </div>
                )}
            </div>
        </FormSection>
    );
}

PricingSection.Skeleton = function PricingSectionSkeleton() {
    return (
        <FormSection
            title="Pricing"
            description="What customers pay, and what it costs you"
            icon={<DollarSign className="w-4.5 h-4.5" strokeWidth={2} />}
            iconWrapperClassName="bg-amber-50 text-amber-700"
        >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                    <div className="h-4 w-20 bg-gray-200 animate-pulse rounded" />
                    <div className="h-10 w-full bg-gray-200 animate-pulse rounded-md border border-gray-100" />
                </div>
                <div className="space-y-2">
                    <div className="h-4 w-24 bg-gray-200 animate-pulse rounded" />
                    <div className="h-10 w-full bg-gray-200 animate-pulse rounded-md border border-gray-100" />
                </div>
                <div className="sm:col-span-2 flex items-center justify-between gap-4 rounded-lg bg-slate-50 border border-slate-200 px-4 py-3">
                    <div className="h-4 w-32 bg-gray-200 animate-pulse rounded" />
                    <div className="h-5 w-24 bg-gray-200 animate-pulse rounded" />
                </div>
            </div>
        </FormSection>
    );
};
