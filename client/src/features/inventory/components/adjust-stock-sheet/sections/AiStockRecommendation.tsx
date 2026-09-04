import { useState } from 'react';
import type { UseFormSetValue } from 'react-hook-form';
import { useLazyQuery } from '@apollo/client';
import {
    Sparkles,
    Bot,
    Check,
    Zap,
    AlertTriangle,
    ShieldCheck,
    RefreshCw,
    TrendingUp,
    Coins,
    CheckCircle2,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { FormSection } from '@/components/ui/form-section';
import { cn, formatCurrency } from '@/lib/utils';
import { GET_AI_STOCK_RECOMMENDATION } from '../../../operations';
import type { AdjustStockFormValues, IAiStockRecommendation } from '../../../types';

export interface AiStockRecommendationProps {
    inventoryId: string;
    currentStock: number;
    reorderLevel: number;
    maxStock: number;
    estimatedDaysOfStock?: number | null;
    productName: string;
    setValue: UseFormSetValue<AdjustStockFormValues>;
}

export function AiStockRecommendation({
    inventoryId,
    currentStock,
    reorderLevel,
    maxStock,
    estimatedDaysOfStock,
    productName,
    setValue,
}: AiStockRecommendationProps) {
    const [isApplied, setIsApplied] = useState(false);

    const [getRecommendation, { data, loading }] = useLazyQuery<{
        getAiStockRecommendation: IAiStockRecommendation;
    }>(GET_AI_STOCK_RECOMMENDATION, {
        fetchPolicy: 'network-only',
        onError: (err) => {
            console.error('Error fetching AI stock recommendation:', err);
            toast.error('Failed to load AI stock recommendation. Please try again.');
        },
    });

    const isLowStock = currentStock <= reorderLevel;
    const isCritical = currentStock <= 0;

    const recommendation = data?.getAiStockRecommendation;

    const handleGenerate = () => {
        setIsApplied(false);
        getRecommendation({
            variables: { inventoryId },
        });
    };

    const handleApply = () => {
        if (!recommendation || recommendation.recommendedQuantity <= 0) return;

        setValue('adjustmentType', 'increase', { shouldDirty: true, shouldValidate: true });
        setValue('quantity', recommendation.recommendedQuantity, { shouldDirty: true, shouldValidate: true });
        setValue('reason', 'PURCHASE', { shouldDirty: true, shouldValidate: true });
        setValue(
            'notes',
            `AI Copilot Plan: +${recommendation.recommendedQuantity} units (${recommendation.targetDaysOfCoverage}-day buffer coverage).`,
            { shouldDirty: true, shouldValidate: true }
        );
        setIsApplied(true);
        toast.success(`Applied AI recommendation: +${recommendation.recommendedQuantity} units to adjustment`);
    };

    const urgencyColor = {
        CRITICAL: 'bg-rose-100/80 text-rose-700 border-rose-200',
        HIGH: 'bg-amber-100/80 text-amber-800 border-amber-200',
        MODERATE: 'bg-indigo-100/80 text-indigo-700 border-indigo-200',
    }[recommendation?.urgencyLevel || (isCritical ? 'CRITICAL' : isLowStock ? 'HIGH' : 'MODERATE')];

    // If stock is healthy and above reorder level
    if (!isLowStock && !recommendation) {
        return (
            <FormSection
                title="AI Copilot: Stock is Optimal"
                description={`Current level (${currentStock} units) exceeds reorder alert (${reorderLevel}).`}
                icon={<ShieldCheck className="h-4 w-4" />}
                iconWrapperClassName="bg-emerald-50 text-emerald-600 border border-emerald-100"
                actions={
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleGenerate}
                        disabled={loading}
                        className="text-xs h-8 px-3 shrink-0 border-slate-200 hover:bg-slate-50 rounded-lg"
                    >
                        {loading ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : 'Run Analysis'}
                    </Button>
                }
            >
                <p className="text-xs text-slate-500 leading-relaxed">
                    AI restock suggestions activate on low stock, but you can run an on-demand analysis anytime.
                </p>
            </FormSection>
        );
    }

    return (
        <FormSection
            title="AI Restock Advisor"
            description="Data-driven replenishment based on sales velocity & warehouse caps"
            icon={<Bot className="h-4 w-4" />}
            iconWrapperClassName="bg-gradient-to-tr from-indigo-600 to-violet-500 text-white shadow-xs"
            actions={
                <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold text-indigo-700 border border-indigo-100/60">
                        <Sparkles className="h-2.5 w-2.5" />
                        Copilot
                    </span>
                    <span
                        className={cn(
                            'shrink-0 rounded-md border px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider',
                            urgencyColor
                        )}
                    >
                        {recommendation?.urgencyLevel || (isCritical ? 'CRITICAL' : 'HIGH ALERT')}
                    </span>
                </div>
            }
        >

            {/* State: Not yet fetched */}
            {!recommendation ? (
                <div className="rounded-xl border border-amber-100 bg-amber-50/50 p-4 space-y-3">
                    <div className="flex items-start gap-2.5">
                        <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
                        <div className="text-xs">
                            <p className="font-semibold text-slate-800">
                                Low stock detected for {productName}
                            </p>
                            <p className="mt-1 text-slate-600 leading-relaxed">
                                Current stock is at <strong className="text-slate-900 font-mono">{currentStock}</strong> (reorder threshold: <strong className="text-slate-900 font-mono">{reorderLevel}</strong>).
                                {estimatedDaysOfStock !== undefined && estimatedDaysOfStock !== null && (
                                    <> Depletion anticipated in ~<strong className="text-slate-900">{estimatedDaysOfStock} days</strong>.</>
                                )}
                            </p>
                        </div>
                    </div>

                    <Button
                        type="button"
                        onClick={handleGenerate}
                        disabled={loading}
                        className="w-full h-9.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-all rounded-lg"
                    >
                        {loading ? (
                            <>
                                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                Analyzing Run-Rates & Warehouse Buffer...
                            </>
                        ) : (
                            <>
                                <Zap className="mr-2 h-3.5 w-3.5" />
                                Generate AI Restock Plan
                            </>
                        )}
                    </Button>
                </div>
            ) : (
                /* State: Generated AI Recommendation - Spacious, Readable & Comfortable */
                <div className="space-y-4">
                    {/* Hero Metric Spotlight: Comfortable horizontal banner without boxed clutter */}
                    <div className="rounded-xl bg-gradient-to-br from-indigo-50/70 via-purple-50/30 to-slate-50/60 p-4 border border-indigo-100/60">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                    Suggested Restock Batch
                                </span>
                                <div className="flex items-baseline gap-1.5 mt-0.5">
                                    <span className="text-3xl font-extrabold text-indigo-600 font-mono tracking-tight">
                                        +{recommendation.recommendedQuantity}
                                    </span>
                                    <span className="text-xs font-medium text-slate-500">units</span>
                                </div>
                            </div>

                            <div className="text-right space-y-1">
                                <div className="text-xs text-slate-600">
                                    <span className="text-slate-400">Post-Restock: </span>
                                    <strong className="text-slate-800 font-mono">
                                        {currentStock + recommendation.recommendedQuantity}
                                    </strong>
                                    <span className="text-slate-400 font-normal"> / {maxStock} cap</span>
                                </div>
                                <div className="text-xs text-slate-600">
                                    <span className="text-slate-400">Buffer Coverage: </span>
                                    <strong className="text-indigo-700 font-mono">
                                        {recommendation.targetDaysOfCoverage} days
                                    </strong>
                                </div>
                            </div>
                        </div>

                        {/* Visual fill progress bar */}
                        {maxStock > 0 && (
                            <div className="mt-3 pt-3 border-t border-indigo-100/60">
                                <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1 font-mono">
                                    <span>Current: {currentStock}</span>
                                    <span className="text-indigo-700 font-bold">
                                        Target: {currentStock + recommendation.recommendedQuantity}
                                    </span>
                                    <span>Max: {maxStock}</span>
                                </div>
                                <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200/80">
                                    <div
                                        className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-500"
                                        style={{
                                            width: `${Math.min(
                                                Math.round(
                                                    ((currentStock + recommendation.recommendedQuantity) / maxStock) * 100
                                                ),
                                                100
                                            )}%`,
                                        }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Executive Assessment & Sales Velocity Tags */}
                    <div className="space-y-2">
                        <p className="text-xs font-medium text-slate-700 leading-relaxed">
                            {recommendation.headline}
                        </p>
                        <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                            <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-slate-600 font-mono">
                                <TrendingUp className="h-3 w-3 text-indigo-500" />
                                {recommendation.salesVelocityDaily} units/day
                            </span>
                            <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-slate-600">
                                {recommendation.stockoutRiskAssessment}
                            </span>
                        </div>
                    </div>

                    {/* Key Strategic Rationale - Clean list with spacious spacing */}
                    <div className="space-y-2 pt-1 border-t border-slate-100">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                            Key Strategic Takeaways
                        </span>
                        <div className="space-y-2">
                            {recommendation.reasoning.map((item, index) => (
                                <div key={index} className="flex items-start gap-2.5 text-xs text-slate-600 leading-relaxed">
                                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-indigo-500 mt-0.5" />
                                    <span>{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Financial Estimates (Clean, unobtrusive horizontal card) */}
                    {recommendation.financialImpact && (
                        <div className="rounded-xl bg-slate-50/80 p-3 flex items-center justify-between text-xs border border-slate-100">
                            <div className="flex items-center gap-2 text-slate-600">
                                <Coins className="h-4 w-4 text-emerald-600 shrink-0" />
                                <div>
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                                        Capital Impact
                                    </span>
                                    <span className="font-semibold text-slate-800">
                                        {recommendation.financialImpact.estimatedRestockCost !== null &&
                                            recommendation.financialImpact.estimatedRestockCost !== undefined
                                            ? `Cost: ${formatCurrency(recommendation.financialImpact.estimatedRestockCost)}`
                                            : `Gross Value: ${formatCurrency(recommendation.financialImpact.potentialRevenue || 0)}`}
                                    </span>
                                </div>
                            </div>
                            {recommendation.financialImpact.projectedProfit !== null &&
                                recommendation.financialImpact.projectedProfit !== undefined && (
                                    <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold font-mono text-emerald-700 border border-emerald-200">
                                        +{formatCurrency(recommendation.financialImpact.projectedProfit)} Profit
                                    </span>
                                )}
                        </div>
                    )}

                    {/* Action button: 1-Click Apply if units > 0, otherwise subtle status info */}
                    <div className="flex items-center gap-2 pt-1">
                        {recommendation.recommendedQuantity > 0 ? (
                            <Button
                                type="button"
                                onClick={handleApply}
                                disabled={isApplied}
                                className={cn(
                                    'flex-1 h-10 text-xs font-semibold shadow-xs transition-all rounded-lg',
                                    isApplied
                                        ? 'bg-emerald-600 hover:bg-emerald-600 text-white'
                                        : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                                )}
                            >
                                {isApplied ? (
                                    <>
                                        <Check className="mr-1.5 h-4 w-4" />
                                        Applied (+{recommendation.recommendedQuantity} Units to Form)
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                                        Apply AI Suggestion (+{recommendation.recommendedQuantity} Units)
                                    </>
                                )}
                            </Button>
                        ) : (
                            <div className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-slate-100/90 py-2.5 px-3 text-xs font-medium text-slate-500 border border-slate-200/60">
                                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                                <span>No restock needed (0 units to add)</span>
                            </div>
                        )}

                        <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={handleGenerate}
                            disabled={loading}
                            title="Re-analyze recommendation"
                            className="h-10 w-10 shrink-0 border-slate-200 text-slate-600 hover:bg-slate-50 rounded-lg"
                        >
                            <RefreshCw className={cn('h-4 w-4', loading && 'animate-spin')} />
                        </Button>
                    </div>

                    {/* AI Disclaimer */}
                    <p className="text-[11px] text-center text-slate-400 font-normal pt-0.5">
                        AI can make mistakes. Please verify recommendations before confirming adjustments.
                    </p>
                </div>
            )}
        </FormSection>
    );
}
