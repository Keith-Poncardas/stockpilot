import { useState } from "react";
import { UserPlus } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@apollo/client";

import { BaseSheetLayout } from "@/components/ui/base-sheet";
import { Button, ButtonLoading } from "@/components/ui/button";
import Alert from "@/components/ui/alert";
import { handleGraphQLError } from "@/lib/utils";

import { CREATE_CUSTOMER } from "../../operations";
import { customerSchema, type CustomerFormValues } from "../../validation";
import { DEFAULT_CUSTOMER_FORM_VALUES } from "../../constants";
import { useCreateCustomerSheet } from "./hooks";
import { CustomerForm } from "../customer-form";

export function CreateCustomerSheet() {
    const { isOpen, onClose } = useCreateCustomerSheet();

    const [createCustomer, { loading }] = useMutation(CREATE_CUSTOMER, {
        refetchQueries: ["GetCustomers", "GetCustomerMetrics"],
        awaitRefetchQueries: true,
        onCompleted: () => {
            onClose();
            reset();
        }
    });

    const [error, setError] = useState<string | null>(null);

    const { control, handleSubmit, setValue, reset, formState: { isDirty } } = useForm<CustomerFormValues>({
        resolver: zodResolver(customerSchema),
        defaultValues: DEFAULT_CUSTOMER_FORM_VALUES,
    });

    const onSubmit = async (data: CustomerFormValues) => {
        setError(null);
        try {
            await createCustomer({ variables: { input: data } });
        } catch (err: any) {
            console.error("Failed to create customer:", err);
            setError(handleGraphQLError(err?.graphQLErrors?.[0]?.message || err?.message || "Failed to create customer."));
        }
    };

    const handleCancel = () => {
        reset();
        onClose();
    };

    const isSubmitDisabled = loading || !isDirty;

    return (
        <BaseSheetLayout
            isOpen={isOpen}
            onClose={handleCancel}
            title="Create New Customer"
            description="Add a new customer to your database."
            icon={UserPlus}
            className="w-[95vw]! sm:max-w-xl! md:max-w-2xl! lg:max-w-3xl! flex flex-col gap-0 p-0"
            onOpenAutoFocus={(e) => e.preventDefault()}
            footer={
                <>
                    <Button
                        type="button"
                        variant="outline"
                        className="h-11 px-6 text-sm font-semibold"
                        onClick={handleCancel}
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                    <ButtonLoading
                        type="submit"
                        form="create-customer-form"
                        loading={loading}
                        disabled={isSubmitDisabled}
                        className="h-11 flex-1 text-sm font-semibold"
                    >
                        Save customer
                    </ButtonLoading>
                </>
            }
        >
            <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 bg-slate-50/50">
                <div className="max-w-3xl mx-auto space-y-6">
                    {error && (
                        <Alert variant="error">
                            {error}
                        </Alert>
                    )}

                    <CustomerForm
                        id="create-customer-form"
                        control={control}
                        setValue={setValue}
                        onSubmit={handleSubmit(onSubmit)}
                    />
                </div>
            </div>
        </BaseSheetLayout>
    );
}
