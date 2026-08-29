

import type { ICustomer } from "@/features/customer-refactor";

interface CustomerSearchResultItemProps {
  customer: ICustomer;
  isSelected?: boolean;
  onSelect: (customer: ICustomer) => void;
}

export function CustomerSearchResultItem({
  customer: c,
  isSelected,
  onSelect,
}: CustomerSearchResultItemProps) {
  const name =
    `${c.firstName ?? ""} ${c.lastName ?? ""}`.trim() || "Unnamed Customer";

  return (
    <li
      role="option"
      aria-selected={isSelected}
      onMouseDown={(e) => {
        e.preventDefault();
        onSelect(c);
      }}
      className={`flex items-center justify-between gap-3 px-3.5 py-3 cursor-pointer hover:bg-slate-50 transition-colors ${isSelected ? "bg-indigo-50/50" : ""
        }`}
    >
      <div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-slate-900">{name}</span>
        </div>
        <span className="block text-xs text-slate-500 mt-0.5">
          {c.phone?.trim() || c.email?.trim() || "No contact info"}
        </span>
      </div>
    </li>
  );
}
