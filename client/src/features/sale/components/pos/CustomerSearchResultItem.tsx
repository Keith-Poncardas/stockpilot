
import { Award } from "lucide-react";
import type { SelectedCustomer } from "../../hooks";

interface CustomerSearchResultItemProps {
  customer: SelectedCustomer;
  isSelected?: boolean;
  onSelect: (customer: SelectedCustomer) => void;
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
      className={`flex items-center justify-between gap-3 px-3.5 py-3 cursor-pointer hover:bg-slate-50 transition-colors ${
        isSelected ? "bg-indigo-50/50" : ""
      }`}
    >
      <div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-slate-900">{name}</span>
          {c.customerType === "VIP" && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-800">
              <Award className="h-3 w-3" />
              VIP
            </span>
          )}
        </div>
        <span className="block text-xs text-slate-500 mt-0.5">
          {c.phone || c.email || "No contact info"}
        </span>
      </div>
    </li>
  );
}
