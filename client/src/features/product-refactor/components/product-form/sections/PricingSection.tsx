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

    const { margin, profit } = useEstimatedMargin(
        unitPrice as number | string | undefined,
        costPrice as number | string | undefined
    );

    const marginDisplay = margin !== null ? `${margin.toFixed(1)}%` : '—';
    const profitDisplay = profit !== null ? `₱${profit.toFixed(2)}` : '';

    return (
        <FormSection
            title="Pricing"
            description="What customers pay, and what it costs you"
            icon={<DollarSign className="w-4.5 h-4.5" strokeWidth={2} />}
            iconWrapperClassName="bg-amber-50 text-amber-700"
        >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                    <FormField
                        name="unitPrice"
                        control={control}
                        label="Selling price"
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
                        name="costPrice"
                        control={control}
                        label={
                            <>
                                Cost price <span className="text-slate-400 font-normal">(optional)</span>
                            </>
                        }
                        type="number"
                        placeholder="0.00"
                        min={0}
                        step="0.01"
                        icon={<PhilippinePeso className="w-4 h-4 text-slate-400" />}
                    />
                </div>
                <div className="sm:col-span-2 flex items-center justify-between gap-4 rounded-lg bg-slate-50 border border-slate-200 px-4 py-3">
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
