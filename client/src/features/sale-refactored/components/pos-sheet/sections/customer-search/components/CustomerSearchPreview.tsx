import { Button } from "@/components/ui/button";
import { Award, X } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface CustomerSearchPreviewProps {
  customer: any;
  onClear: () => void;
}

export function CustomerSearchPreview({ customer, onClear }: CustomerSearchPreviewProps) {
  if (!customer) return null;

  const name = `${customer.firstName ?? ""} ${customer.lastName ?? ""}`.trim() || "Unnamed Customer";

  return (
    <div className="mt-4 rounded-lg border border-hairline bg-[#F5F6F2]/70 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p
              id="detail-name"
              className="font-semibold text-ink leading-snug truncate"
            >
              {name}
            </p>
            {customer.customerType === "VIP" && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-800">
                <Award className="h-3 w-3" />
                VIP
              </span>
            )}
          </div>
          <p id="detail-contact" className="font-mono text-xs mt-0.5 text-foreground/60">
            {customer.phone || customer.email || "No contact info"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={onClear}
            aria-label="Remove selected customer"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <p className="mt-2 text-sm text-ink/60">
        {[customer.addressLine1, customer.city, customer.province]
          .filter(Boolean)
          .join(", ") || "No address on file."}
      </p>
      <dl className="mt-3 grid grid-cols-2 gap-3 border-t border-hairline pt-3">
        <div>
          <dt className="text-xs text-foreground/60">Total orders</dt>
          <dd className="font-mono text-sm text-ink mt-0.5">
            {customer.totalOrders ?? 0}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-foreground/60">Total spent</dt>
          <dd className="font-mono text-sm text-ink mt-0.5">
            {formatCurrency(customer.totalSpent ?? 0)}
          </dd>
        </div>
      </dl>
    </div>
  );
}
