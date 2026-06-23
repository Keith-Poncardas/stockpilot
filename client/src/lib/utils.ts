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

export function getStatusColor(status?: string) {
  switch (status?.toUpperCase()) {
    case 'ACTIVE':
      return 'bg-teal-100 text-teal-700'
    case 'PENDING':
      return 'bg-orange-100 text-orange-700'
    case 'SUSPENDED':
      return 'bg-pink-100 text-pink-700'
    case 'INACTIVE':
    case 'TERMINATED':
      return 'bg-slate-100 text-slate-700'
    default:
      return 'bg-gray-100 text-gray-700'
  }
}

export function getApprovalStatusColor(status?: string) {
  switch (status?.toUpperCase()) {
    case 'APPROVED':
      return 'bg-cyan-100 text-cyan-700'
    case 'REJECTED':
      return 'bg-red-100 text-red-700'
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800'
    default:
      return 'bg-zinc-100 text-zinc-700'
  }
}

export function getRoleColor(role?: string) {
  switch (role?.toUpperCase()) {
    case 'SUPER_ADMIN':
      return 'bg-violet-100 text-violet-700'
    case 'ADMIN':
      return 'bg-rose-100 text-rose-700'
    case 'MANAGER':
      return 'bg-blue-100 text-blue-700'
    case 'CASHIER':
      return 'bg-emerald-100 text-emerald-700'
    default:
      return 'bg-amber-100 text-amber-700'
  }
}
