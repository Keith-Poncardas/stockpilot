import { useQuery } from '@apollo/client';
import { GET_CUSTOMER, type ICustomerDetails } from '@/features/customer-refactor';
import { AlertCircle, DollarSign, Receipt, TrendingUp, Calendar } from 'lucide-react';
import { MetricCard } from '@/components';
import { EmptyState } from '@/components/ui/empty-state';
import { handleGraphQLError, formatCurrency, formatDate } from '@/lib/utils';
import { ViewCustomerDetailsLayout } from './layout/ViewCustomerDetailsLayout';
import { ViewCustomerSheetSkeleton } from './skeleton';
import {
    CustomerInfoSection,
    CustomerAddressSection,
    CustomerPurchaseSummarySection,
    CustomerPurchaseHistorySection
} from './sections';

interface ViewCustomerDetailsProps {
    customerId: string;
}

export function ViewCustomerDetails({ customerId }: ViewCustomerDetailsProps) {
    const { data, loading, error } = useQuery(GET_CUSTOMER, {
        variables: { id: customerId },
        skip: !customerId,
        fetchPolicy: "cache-and-network",
    });

    if (loading) {
        return <ViewCustomerSheetSkeleton />;
    }

    if (error || !data?.getCustomer) {
        return (
            <div className="py-6 h-full flex flex-col justify-center">
                <EmptyState
                    icon={AlertCircle}
                    title="Customer not found"
                    description={handleGraphQLError(
                        error?.graphQLErrors?.[0]?.message ?? error?.networkError?.message ?? "Customer could not be loaded."
                    )}
                    iconClassName="text-red-500"
                    iconWrapperClassName="bg-red-50"
                />
            </div>
        );
    }

    const customer: ICustomerDetails = data.getCustomer;
    const salesList = customer.purchaseHistory?.data ?? customer.sales ?? customer.recentSales ?? [];

    const totalSpent = customer.purchaseSummary?.totalSpent ?? customer.totalSpent ?? 0;
    const totalOrders = customer.purchaseSummary?.totalOrders ?? customer.totalOrders ?? 0;
    const averageOrderValue = customer.purchaseSummary?.averageOrderValue ?? customer.averageOrderValue ?? 0;
    const lastPurchase = customer.purchaseSummary?.lastPurchase ?? customer.lastPurchase;

    const metricsHeader = (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
                value={formatCurrency(totalSpent)}
                label="Total Spent"
                icon={<DollarSign className="w-5 h-5" />}
                iconContainerClass="bg-emerald-50 text-emerald-600"
            />
            <MetricCard
                value={totalOrders.toLocaleString()}
                label="Total Orders"
                icon={<Receipt className="w-5 h-5" />}
                iconContainerClass="bg-blue-50 text-blue-600"
            />
            <MetricCard
                value={formatCurrency(averageOrderValue)}
                label="Avg. Order Value"
                icon={<TrendingUp className="w-5 h-5" />}
                iconContainerClass="bg-amber-50 text-amber-600"
            />
            <MetricCard
                value={lastPurchase ? formatDate(lastPurchase) : '—'}
                label="Last Purchase"
                icon={<Calendar className="w-5 h-5" />}
                iconContainerClass="bg-violet-50 text-violet-600"
            />
        </div>
    );

    return (
        <ViewCustomerDetailsLayout
            metrics={metricsHeader}
            customerInfo={<CustomerInfoSection customer={customer} />}
            addressInfo={<CustomerAddressSection customer={customer} />}
            purchaseSummary={<CustomerPurchaseSummarySection customer={customer} />}
            purchaseHistory={<CustomerPurchaseHistorySection sales={salesList} isLoading={loading} />}
            actions={null}
        />
    );
}
