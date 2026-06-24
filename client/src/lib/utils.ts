import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
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
