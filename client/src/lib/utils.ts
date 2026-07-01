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

export function formatDate(
  date: string | number | Date,
  locale: string = "en-US"
): string {
  const parsedDate =
    date instanceof Date ? date : new Date(Number(date));

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
