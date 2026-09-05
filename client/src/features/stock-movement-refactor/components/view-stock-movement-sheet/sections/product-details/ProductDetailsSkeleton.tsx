import { FormSection } from '@/components/ui/form-section';
import { Package } from 'lucide-react';
import { ProductDetailsLayout } from './ProductDetailsLayout';

export function ProductDetailsSkeleton() {
    return (
        <FormSection
            title="Product"
            description="Details of the product affected by this movement."
            icon={<Package className="w-4.5 h-4.5" strokeWidth={2} />}
            iconWrapperClassName="bg-blue-50 text-blue-600"
        >
            <ProductDetailsLayout
                identityRow={
                    <>
                        <div className="flex items-center gap-4">
                            <div className="h-14 w-14 rounded-lg bg-slate-100 animate-pulse shrink-0" />
                            <div className="min-w-0">
                                <div className="h-8 w-48 bg-slate-100 animate-pulse rounded mb-1.5" />
                                <div className="h-5 w-24 bg-slate-100 animate-pulse rounded" />
                            </div>
                        </div>
                        <div className="h-8 w-20 bg-slate-100 animate-pulse rounded" />
                    </>
                }
                pricingGrid={
                    <>
                        <div>
                            <div className="h-3 w-16 bg-slate-100 animate-pulse rounded mb-1" />
                            <div className="h-6 w-20 bg-slate-100 animate-pulse rounded" />
                        </div>
                        <div>
                            <div className="h-3 w-20 bg-slate-100 animate-pulse rounded mb-1" />
                            <div className="h-6 w-24 bg-slate-100 animate-pulse rounded" />
                        </div>
                    </>
                }
            />
        </FormSection>
    );
}
