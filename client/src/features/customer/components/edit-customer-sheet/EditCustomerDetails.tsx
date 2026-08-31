import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@apollo/client";
import { toast } from "sonner";
import { AlertCircle, Loader2 } from "lucide-react";

import { Button, ButtonLoading } from "@/components/ui/button";
import Alert from "@/components/ui/alert";
import { EmptyState } from "@/components/ui/empty-state";
import { handleGraphQLError } from "@/lib/utils";

import { EDIT_CUSTOMER, GET_CUSTOMER } from "../../operations";
import { customerSchema, type CustomerFormValues } from "../../validation";
import { normalizeProvinceCode, normalizeCityCode, normalizeBarangayCode } from "../../utils";
import { CustomerForm } from "../customer-form";

interface EditCustomerDetailsProps {
    customerId: string;
    onClose: () => void;
}

interface EditCustomerFormProps {
    customerId: string;
    customer: any;
    onClose: () => void;
}

function EditCustomerForm({ customerId, customer, onClose }: EditCustomerFormProps) {
    const [error, setError] = useState<string | null>(null);

    const [editCustomer, { loading: updatingCustomer }] = useMutation(EDIT_CUSTOMER, {
        refetchQueries: ["GetCustomers", "GetCustomerMetrics", "GetCustomer"],
        awaitRefetchQueries: true,
    });

    const initialValues: CustomerFormValues = useMemo(() => {
        const normProvince = normalizeProvinceCode(customer.provinceCode);
        const normCity = normalizeCityCode(customer.cityCode, normProvince);
        const normBarangay = normalizeBarangayCode(customer.barangayCode, normCity);

        return {
            firstName: customer.firstName || "",
            lastName: customer.lastName || "",
            phone: customer.phone || "",
            email: customer.email || "",
            addressLine1: customer.addressLine1 || "",
            addressLine2: customer.addressLine2 || "",
            provinceCode: normProvince,
            cityCode: normCity,
            barangayCode: normBarangay,
            postalCode: customer.postalCode || "",
        };
    }, [customer]);

    const {
        control,
        handleSubmit,
        setValue,
        formState: { isDirty },
    } = useForm<CustomerFormValues>({
        resolver: zodResolver(customerSchema),
        defaultValues: initialValues,
    });

    const onSubmit = async (formData: CustomerFormValues) => {
        setError(null);
        try {
            await editCustomer({
                variables: {
                    input: {
                        id: customerId,
                        ...formData,
                    },
                },
            });
            toast.success("Customer updated successfully");
            onClose();
        } catch (err: unknown) {
            console.error("Failed to update customer:", err);
            setError(handleGraphQLError(err));
        }
    };

    const isSubmitDisabled = updatingCustomer || !isDirty;

    return (
        <div className="flex flex-col min-h-0 h-full">
            <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 bg-slate-50/50">
                <div className="max-w-3xl mx-auto space-y-6">
                    {error && (
                        <Alert variant="error">
                            {error}
                        </Alert>
                    )}

                    <CustomerForm
                        id="edit-customer-form"
                        control={control}
                        setValue={setValue}
                        onSubmit={handleSubmit(onSubmit)}
                    />
                </div>
            </div>

            <div className="px-4 sm:px-6 py-4 border-t border-slate-200 bg-white flex items-center justify-end gap-3 sticky bottom-0 z-10 shrink-0">
                <Button
                    type="button"
                    variant="outline"
                    className="h-11 px-6 text-sm font-semibold"
                    onClick={onClose}
                    disabled={updatingCustomer}
                >
                    Cancel
                </Button>
                <ButtonLoading
                    type="submit"
                    form="edit-customer-form"
                    loading={updatingCustomer}
                    disabled={isSubmitDisabled}
                    className="h-11 flex-1 sm:flex-initial sm:px-8 text-sm font-semibold"
                >
                    Save Changes
                </ButtonLoading>
            </div>
        </div>
    );
}

export function EditCustomerDetails({ customerId, onClose }: EditCustomerDetailsProps) {
    const { data, loading: fetchingCustomer, error: queryError } = useQuery(GET_CUSTOMER, {
        variables: { id: customerId },
        fetchPolicy: "network-only",
    });

    if (fetchingCustomer) {
        return (
            <div className="flex flex-col items-center justify-center py-24 gap-3 text-slate-500">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="text-sm font-medium">Loading customer details...</p>
            </div>
        );
    }

    if (queryError || !data?.getCustomer) {
        return (
            <div className="py-12 px-4">
                <EmptyState
                    icon={AlertCircle}
                    title="Customer not found"
                    description={handleGraphQLError(queryError || "Could not load customer information.")}
                    iconClassName="text-red-500"
                    iconWrapperClassName="bg-red-50"
                />
            </div>
        );
    }

    return (
        <EditCustomerForm
            customerId={customerId}
            customer={data.getCustomer}
            onClose={onClose}
        />
    );
}
