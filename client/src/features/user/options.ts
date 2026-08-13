import React from 'react';
import { Users, CheckCircle, Clock } from 'lucide-react';
import { cleanObject } from '@/lib/utils';
import type { UserFilters, UserQueryFilters } from './types';

/**
 * Options for user roles in the system.
 * Used for dropdown selections and filtering by user role.
 */
export const roleOptions = [
    { value: 'all', label: 'All Roles' },
    { value: 'SUPER_ADMIN', label: 'Super Admin' },
    { value: 'ADMIN', label: 'Admin' },
    { value: 'MANAGER', label: 'Manager' },
    { value: 'CASHIER', label: 'Cashier' },
    { value: 'UNASSIGNED', label: 'Unassigned' }
]

/**
 * Options for the account status of users.
 * Represents active, suspended, or terminated states for filtering.
 */
export const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'ACTIVE', label: 'Active' },
    { value: 'SUSPENDED', label: 'Suspended' },
    { value: 'TERMINATED', label: 'Terminated' },
]

/**
 * Options for the registration approval status of users.
 * Used to filter users by pending, approved, or rejected states.
 */
export const approvalStatusOptions = [
    { value: 'all', label: 'All Approval Statuses' },
    { value: 'PENDING', label: 'Pending' },
    { value: 'APPROVED', label: 'Approved' },
    { value: 'REJECTED', label: 'Rejected' },
]

/**
 * Sorting options for ordering records by creation date.
 * Allows sorting by newest (desc) or oldest (asc) first.
 */
export const acsDescOptions = [
    { value: 'desc', label: 'Latest' },
    { value: 'asc', label: 'Oldest' }
]

/**
 * Generates the filter options configuration for the DataTableToolbar.
 */
export const getFilterOptions = (
    filters: UserFilters,
    setFilters: (updater: (prev: UserFilters) => UserFilters) => void
) => [
        {
            value: filters.role,
            onChange: (val: string) => setFilters(prev => ({ ...prev, role: val })),
            options: roleOptions
        },
        {
            value: filters.status,
            onChange: (val: string) => setFilters(prev => ({ ...prev, status: val })),
            options: statusOptions
        },
        {
            value: filters.approvalStatus,
            onChange: (val: string) => setFilters(prev => ({ ...prev, approvalStatus: val })),
            options: approvalStatusOptions
        },
        {
            value: filters.acsDesc,
            onChange: (val: string) => setFilters(prev => ({ ...prev, acsDesc: val })),
            options: acsDescOptions,
            defaultValue: "desc"
        },
    ];

/**
 * Generates the configuration array for user metric cards.
 * Uses React.createElement to return icon components.
 */
export const getMetricsCards = (userMetricsData: any) => {
    const metrics = userMetricsData?.getUserMetrics || {};
    const { total, active, pendingApproval } = metrics;

    return [
        {
            value: total,
            label: 'Total Users',
            icon: React.createElement(Users, { className: 'w-5 h-5' })
        },
        {
            value: active,
            label: 'Active Users',
            icon: React.createElement(CheckCircle, { className: 'w-5 h-5' })
        },
        {
            value: pendingApproval,
            label: 'Pending Approval',
            icon: React.createElement(Clock, { className: 'w-5 h-5' })
        }
    ];
};

/**
 * Constructs the query filter object for the Apollo GraphQL query.
 */
export const buildUserQueryFilter = (
    filters: UserQueryFilters,
    queryParams: any,
    dateFrom: string | undefined,
    dateTo: string | undefined
) => {
    return cleanObject({
        search: filters.search,
        role: filters.role,
        status: filters.status,
        approvalStatus: filters.approvalStatus,
        dateFrom,
        dateTo,
        orderBy: filters.acsDesc ? 'createdAt' : queryParams.orderBy,
        orderDirection: filters.acsDesc ? (filters.acsDesc as any) : queryParams.orderDirection,
    });
};