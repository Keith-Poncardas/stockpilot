import React, { useState, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useLazyQuery } from "@apollo/client";

import { useDebounce } from "@/hooks/useDebounce";
import { FormSection } from "@/components/ui/form-section";
import { FormField } from "@/components/ui/form-field";
import { VirtualInfiniteList } from "@/components/ui/virtual-infinite-list";
import { User, Search } from "lucide-react";
import type { SelectedCustomer } from "../../hooks";
import { useInfiniteCustomerSearch } from "../../hooks/useInfiniteCustomerSearch";
import { CustomerSearchResultItem } from "./CustomerSearchResultItem";
import { CustomerSearchPreview } from "./CustomerSearchPreview";
import { GET_CUSTOMER } from "@/features/customer/operations/op.queries";

interface CustomerSearchSectionProps {
  selectedCustomer: SelectedCustomer | null;
  onSelectCustomer: (customer: SelectedCustomer | null) => void;
}

export const CustomerSearchSection: React.FC<CustomerSearchSectionProps> = ({
  selectedCustomer,
  onSelectCustomer,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const { control, setValue } = useForm({
    defaultValues: {
      searchQuery: "",
    },
  });

  const searchTerm = useWatch({ control, name: "searchQuery" });
  const debouncedSearch = useDebounce(searchTerm || "", 300);

  const [fetchCustomer, { data: customerData, loading: customerLoading }] =
    useLazyQuery(GET_CUSTOMER);
  const customer = customerData?.getCustomer;

  useEffect(() => {
    if (selectedCustomer?.id) {
      fetchCustomer({ variables: { id: selectedCustomer.id } });
    }
  }, [selectedCustomer?.id, fetchCustomer]);

  const {
    items: customers,
    loading,
    isFetchingMore,
    hasNextPage,
    loadMore,
  } = useInfiniteCustomerSearch(debouncedSearch);

  return (
    <FormSection
      title="Customer"
      description="Select a customer or leave it empty as walk in customer."
      icon={<User className="h-4.5 w-4.5" strokeWidth={2} />}
      iconWrapperClassName="bg-indigo-50 text-indigo-600"
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
          isLoading={loading || customerLoading}
        />

        {isOpen && (
          <VirtualInfiniteList
            items={customers}
            loading={loading}
            isFetchingMore={isFetchingMore}
            hasNextPage={hasNextPage}
            onLoadMore={loadMore}
            emptyMessage="No customers found. Try a different name, phone, or email."
            aria-label="Customer search results"
            renderItem={(item) => (
              <CustomerSearchResultItem
                customer={item}
                isSelected={selectedCustomer?.id === item.id}
                onSelect={(c) => {
                  const fullName = `${c.firstName ?? ""} ${c.lastName ?? ""}`.trim();
                  onSelectCustomer(c);
                  setValue("searchQuery", fullName);
                  fetchCustomer({ variables: { id: c.id } });
                  setIsOpen(false);
                }}
              />
            )}
          />
        )}
      </div>

      {!selectedCustomer || !customer ? (
        <div className="mt-4 rounded-lg border border-dashed border-hairline p-4 text-sm text-foreground/50">
          No customer selected yet — search above to add one to this sale.
        </div>
      ) : (
        <CustomerSearchPreview
          customer={customer}
          onClear={() => {
            onSelectCustomer(null);
            setValue("searchQuery", "");
          }}
        />
      )}
    </FormSection>
  );
};
