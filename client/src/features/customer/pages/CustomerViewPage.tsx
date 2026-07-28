import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_CUSTOMER } from '../operations';
import {
    AlertTriangle,
    DollarSign,
    Receipt,
    TrendingUp,
    Calendar,
} from 'lucide-react';
import { EmptyState } from '@/components/ui/empty-state';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MetricCard } from '@/components/MetricCard';
import { ProfileViewLayout } from '@/components/ProfileViewLayout';
import { formatDate, formatCurrency, handleGraphQLError } from '@/lib/utils';
import {
    formatCustomerName,
    formatLocation,
    getCustomerInitials,
} from '../customer.utils';
import type { ICustomerDetails } from '../customer.types';
import {
    CustomerInfoSection,
    CustomerAddressSection,
    CustomerPurchaseSummarySection,
    CustomerPurchaseHistorySection,
} from '../components';

export function CustomerViewPage() {
    const { customerId } = useParams<{ customerId: string }>();

    const { data, loading, error } = useQuery(GET_CUSTOMER, {
        variables: { id: customerId },
        skip: !customerId,
    });

    if (loading) {
        return (
            <ProfileViewLayout isLoading={true} backLabel="Back to Customers" backUrl="/customers">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="bg-white rounded-2xl border border-[#E3E1DC] h-24 animate-pulse" />
                    ))}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-pulse">
                    <div className="lg:col-span-1 flex flex-col gap-6">
                        <div className="bg-white rounded-2xl border border-[#E3E1DC] h-64" />
                        <div className="bg-white rounded-2xl border border-[#E3E1DC] h-64" />
                    </div>
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl border border-[#E3E1DC] h-96" />
                    </div>
                </div>
            </ProfileViewLayout>
        );
    }

    if (error || !data?.getCustomer) {
        return (
            <div className="py-6">
                <EmptyState
                    icon={AlertTriangle}
                    title="Customer not found"
                    description={handleGraphQLError(
                        error?.graphQLErrors?.[0]?.message ?? error?.networkError?.message
                    )}
                    showBackButton
                />
            </div>
        );
    }

    const customer: ICustomerDetails = data.getCustomer;
    const displayName = formatCustomerName(customer.firstName, customer.lastName, customer.email);
    const initials = getCustomerInitials(customer.firstName, customer.lastName, customer.email);
    const totalOrders = customer.totalOrders ?? customer.purchaseSummary?.totalOrders ?? 0;
    const totalSpent = customer.totalSpent ?? customer.purchaseSummary?.totalSpent ?? 0;
    const averageOrderValue =
        customer.averageOrderValue ?? customer.purchaseSummary?.averageOrderValue ?? 0;
    const lastPurchase = customer.lastPurchase ?? customer.purchaseSummary?.lastPurchase;
    const salesList = customer.sales ?? customer.recentSales ?? [];

    return (
        <ProfileViewLayout
            title={displayName}
            subtitle={
                <>
                    <span>{formatLocation(customer.city, customer.province)}</span>
                    <span>·</span>
                    <span>Customer since {formatDate(customer.createdAt)}</span>
                </>
            }
            stamp="Customer"
            avatar={
                <Avatar size="2xl" className="size-32 md:size-40 border-4 border-white shadow-md bg-indigo-100 rounded-full">
                    <AvatarFallback className="bg-indigo-100 text-3xl font-bold text-indigo-700">
                        {initials}
                    </AvatarFallback>
                </Avatar>
            }
            backLabel="Back to Customers"
            backUrl="/customers"
            coverClassName="bg-gradient-to-r from-slate-800 via-emerald-950 to-slate-800"
        >
            {/* ── Stats Row ─────────────────────────────────────────────── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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

            {/* ── Main Grid ─────────────────────────────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left column — details */}
                <div className="lg:col-span-1 flex flex-col gap-6">
                    <CustomerInfoSection customer={customer} />
                    <CustomerAddressSection customer={customer} />
                    <CustomerPurchaseSummarySection customer={customer} />
                </div>

                {/* Right column — purchase history table */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                    <CustomerPurchaseHistorySection sales={salesList} isLoading={loading} />
                </div>
            </div>
        </ProfileViewLayout>
    );
}
