import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumber(
  number: number,
  locale: string = "en-US"
): string {
  return new Intl.NumberFormat(locale).format(number);
}

export function formatCurrency(
  value: number,
  currency: string = "PHP",
  locale: string = "en-PH"
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
  }).format(value);
}

export function formatDate(
  date: string | number | Date,
  locale: string = "en-US"
): string {
  let parsedDate: Date;
  if (date instanceof Date) {
    parsedDate = date;
  } else if (typeof date === 'number') {
    parsedDate = new Date(date);
  } else if (typeof date === 'string') {
    const isNumeric = /^\d+$/.test(date);
    parsedDate = new Date(isNumeric ? Number(date) : date);
  } else {
    parsedDate = new Date(date as any);
  }

  if (isNaN(parsedDate.getTime())) {
    throw new Error("Invalid date");
  }

  return new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(parsedDate);
}

import { STATUS_COLORS, APPROVAL_STATUS_COLORS, ROLE_COLORS } from "@/config/colors"

export function getStatusColor(status?: string) {
  const upperStatus = status?.toUpperCase() || '';
  return STATUS_COLORS[upperStatus] || STATUS_COLORS.DEFAULT;
}

export function getApprovalStatusColor(status?: string) {
  const upperStatus = status?.toUpperCase() || '';
  return APPROVAL_STATUS_COLORS[upperStatus] || APPROVAL_STATUS_COLORS.DEFAULT;
}

export function getRoleColor(role?: string) {
  const upperRole = role?.toUpperCase() || '';
  return ROLE_COLORS[upperRole] || ROLE_COLORS.DEFAULT;
}

import { ErrorCode } from "@/constants";

export function handleGraphQLError(err: any): string {
  const isInternalError = err?.graphQLErrors?.some(
    (graphqlErr: any) => graphqlErr?.extensions?.code === ErrorCode.INTERNAL_SERVER_ERROR
  );

  if (isInternalError) {
    return "Internal Server Error. Please try again later.";
  }

  return err?.message || "An unexpected error occurred.";
}

export function cleanObject<T extends Record<string, any>>(obj: T): Partial<T> {
  const cleaned: Partial<T> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined && value !== null && value !== '') {
      cleaned[key as keyof T] = value;
    }
  }
  return cleaned;
}
