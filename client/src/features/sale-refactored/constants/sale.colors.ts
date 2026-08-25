import { SaleStatus, SalePaymentMethod } from "./sale.constants";
import type { SaleStatus as SaleStatusType, SalePaymentMethod as SalePaymentMethodType } from "../types";

/**
 * Tailwind CSS class mapping for Sale Statuses.
 * Uses the constant values from SaleStatus as keys to ensure synchronicity.
 */
export const SALE_STATUS_COLORS: Record<SaleStatusType, string> = {
    [SaleStatus.PENDING]: "bg-amber-50 text-amber-700 border-amber-100/80",
    [SaleStatus.COMPLETED]: "bg-emerald-50 text-emerald-700 border-emerald-100/80",
    [SaleStatus.REFUNDED]: "bg-purple-50 text-purple-700 border-purple-100/80",
    [SaleStatus.VOIDED]: "bg-slate-100 text-slate-600 border-slate-200/80",
};

/**
 * Tailwind CSS class mapping for Sale Payment Methods.
 * Uses the constant values from SalePaymentMethod as keys to ensure synchronicity.
 */
export const SALE_PAYMENT_METHOD_COLORS: Record<SalePaymentMethodType, string> = {
    [SalePaymentMethod.CASH]: "bg-emerald-50 text-emerald-700 border-emerald-100/80",
    [SalePaymentMethod.GCASH]: "bg-blue-50 text-blue-700 border-blue-100/80",
    [SalePaymentMethod.BANK_TRANSFER]: "bg-indigo-50 text-indigo-700 border-indigo-100/80",
    [SalePaymentMethod.CREDIT_CARD]: "bg-violet-50 text-violet-700 border-violet-100/80",
    [SalePaymentMethod.DEBIT_CARD]: "bg-cyan-50 text-cyan-700 border-cyan-100/80",
};
