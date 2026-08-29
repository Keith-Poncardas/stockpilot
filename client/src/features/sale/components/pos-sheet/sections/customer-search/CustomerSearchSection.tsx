import { useState, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import type { ICustomer } from "@/features/customer-refactor";

import { FormSection } from "@/components/ui/form-section";
import { FormField } from "@/components/ui/form-field";
import { VirtualInfiniteList } from "@/components/ui/virtual-infinite-list";
import { User, Search } from "lucide-react";
import { CustomerSearchResultItem } from "./components/CustomerSearchResultItem";
import { CustomerSearchPreview } from "./components/CustomerSearchPreview";
import type { CustomerSearchSectionProps } from "./types";
import { CustomerSearchSkeleton } from "./skeleton/CustomerSearchSkeleton";

export const CustomerSearchSection = ({
  selectedCustomer,
  onSelectCustomer,
  customers,
  loading,
  hasNextPage,
  onLoadMore,
  onSearchTermChange,
  isFetchingMore = false,
}: CustomerSearchSectionProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const { control, setValue } = useForm({
    defaultValues: {
      searchQuery: "",
    },
  });

  const watchSearchQuery = useWatch({ control, name: "searchQuery" });

  useEffect(() => {
    onSearchTermChange(watchSearchQuery || "");
  }, [watchSearchQuery, onSearchTermChange]);

  return (
    <FormSection
      title="Customer"
      description="Select a customer or leave it empty as walk in customer."
      icon={<User className="h-4.5 w-4.5" strokeWidth={2} />}
      iconWrapperClassName="bg-indigo-50 text-indigo-600"
      className="overflow-visible"
    >
      <div
        className="mt-3 relative"
        onFocus={() => setIsOpen(true)}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget)) setIsOpen(false);
        }}
      >
        <FormField
          control={control}
          name="searchQuery"
          label="Select customer"
          placeholder="Search by name, phone, or email..."
          icon={<Search className="h-5 w-4 text-ink/40" />}
          isLoading={false}
        />

        {isOpen && (
          <VirtualInfiniteList
            items={customers}
            loading={loading}
            isFetchingMore={isFetchingMore}
            hasNextPage={hasNextPage}
            onLoadMore={onLoadMore}
            emptyMessage="No customers found. Try a different name, phone, or email."
            aria-label="Customer search results"
            renderItem={(item) => (
              <CustomerSearchResultItem
                customer={item as ICustomer}
                isSelected={selectedCustomer?.id === item.id}
                onSelect={(c) => {
                  const fullName = `${c.firstName ?? ""} ${c.lastName ?? ""}`.trim();
                  onSelectCustomer(c);
                  setValue("searchQuery", fullName);
                  setIsOpen(false);
                }}
              />
            )}
          />
        )}
      </div>

      {!selectedCustomer ? (
        <div className="mt-4 rounded-lg border border-dashed border-hairline p-4 text-sm text-foreground/50">
          No customer selected yet — search above to add one to this sale.
        </div>
      ) : (
        <CustomerSearchPreview
          customer={selectedCustomer}
          onClear={() => {
            onSelectCustomer(null);
            setValue("searchQuery", "");
          }}
        />
      )}
    </FormSection>
  );
};

CustomerSearchSection.Skeleton = CustomerSearchSkeleton;
