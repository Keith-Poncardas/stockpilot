import { DollarSign, PhilippinePeso } from 'lucide-react';
import { useWatch, type Control } from 'react-hook-form';
import { FormField } from '@/components/ui/form-field';
import { FormSection } from '@/components/ui/form-section';
import { useEstimatedMargin } from '@/features/product/hooks/use-estimated-margin';

interface PricingProps {
    control: Control<any>;
}

export function Pricing({ control }: PricingProps) {
    const unitPrice = useWatch({ control, name: 'unitPrice' });
    const costPrice = useWatch({ control, name: 'costPrice' });

    const { margin, profit } = useEstimatedMargin(unitPrice, costPrice);

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
                    <span
                        className="font-mono text-sm font-semibold text-slate-600"
                    >
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
    )
}
