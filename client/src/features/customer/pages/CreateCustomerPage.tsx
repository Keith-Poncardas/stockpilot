import { CustomerFormLayout } from "../components";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { PATHS } from "@/routes";
import { useMutation } from "@apollo/client";
import { CREATE_CUSTOMER } from "../operations";
import { customerSchema, type CustomerFormValues } from "../validation";
import { useState } from "react";
import { handleGraphQLError } from "@/lib/utils";

export function CreateCustomerPage() {
    const navigate = useNavigate();
    const [createCustomer, { loading }] = useMutation(CREATE_CUSTOMER, {
        refetchQueries: ["GetCustomers", "GetCustomerMetrics"],
        awaitRefetchQueries: true,
        onCompleted: () => navigate(PATHS.customers.root)
    });

    const [error, setError] = useState<string | null>(null);

    const { control, handleSubmit, setValue } = useForm<CustomerFormValues>({
        resolver: zodResolver(customerSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            phone: "",
            email: "",
            addressLine1: "",
            addressLine2: "",
            city: "",
            province: "",
            postalCode: "",
            country: "Philippines",
        }
    });

    const onSubmit = async (data: CustomerFormValues) => {
        setError(null);
        try {
            await createCustomer({ variables: { input: data } });
        } catch (err: any) {
            console.error("Failed to create customer:", err);
            // Show inline error for duplicate phone/email or other server errors
            setError(handleGraphQLError(err?.graphQLErrors?.[0]?.message || err?.message || "Failed to create customer."));
        }
    };

    function handleCancel() {
        navigate(PATHS.customers.root);
    }

    return (
        <CustomerFormLayout
            title="Create New Customer"
            subtitle="Add a new customer to your database."
            loading={loading}
            error={error}
            onCancel={handleCancel}
            onSubmit={onSubmit}
            handleSubmit={handleSubmit}
            control={control}
            setValue={setValue}
            submitText="Save customer"
            loadingText="Saving..."
        />
    );
}
