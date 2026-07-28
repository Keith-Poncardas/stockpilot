import { useFormState, type UseFormHandleSubmit, type Control, type UseFormSetValue } from "react-hook-form";
import { Button, ButtonLoading } from "@/components/ui/button";
import { MobileActionBar } from "@/components/ui/mobile-action-bar";
import { Header } from "@/features/product/components/Header";
import { PersonalInfo } from "./PersonalInfo";
import { AddressInfo } from "./AddressInfo";
import Alert from "@/components/ui/alert";

export interface CustomerFormLayoutProps {
    title: string;
    subtitle: string;
    loading: boolean;
    error?: string | null;
    onCancel: () => void;
    onSubmit: (data: any) => void;
    handleSubmit: UseFormHandleSubmit<any>;
    control: Control<any>;
    setValue?: UseFormSetValue<any>;
    submitText?: string;
    loadingText?: string;
    isEditMode?: boolean;
}

export function CustomerFormLayout({
    title,
    subtitle,
    loading,
    error,
    onCancel,
    onSubmit,
    handleSubmit,
    control,
    setValue,
    submitText = "Save customer",
    loadingText = "Saving...",
    isEditMode = false
}: CustomerFormLayoutProps) {
    const { isDirty } = useFormState({ control });
    const isSubmitDisabled = loading || (isEditMode && !isDirty);

    return (
        <>
            <Header
                title={title}
                subtitle={subtitle}
                actions={
                    <>
                        <Button
                            type="button"
                            variant="glass"
                            size="lg"
                            onClick={onCancel}
                        >
                            Cancel
                        </Button>
                        <ButtonLoading
                            type="submit"
                            form="customer-form"
                            size="lg"
                            loading={loading}
                            disabled={isSubmitDisabled}
                        >
                            {submitText}
                        </ButtonLoading>
                    </>
                }
            />

            <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                {error && (
                    <Alert variant="error">
                        {error}
                    </Alert>
                )}

                <form
                    id="customer-form"
                    onSubmit={handleSubmit(onSubmit)}
                    className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start max-sm:mb-15"
                >

                    <div className="lg:col-span-2 flex flex-col gap-6">
                        <PersonalInfo control={control as any} />
                        <AddressInfo control={control as any} setValue={setValue} />
                    </div>
                    
                    {/* Placeholder for right sidebar card if needed. Product had ProductPreview. We can just leave it empty or add a summary card. For now, empty div to keep layout. */}
                    <div className="hidden lg:block lg:col-span-1">
                        {/* We can add a summary card here later if desired. It mirrors the ProductFormLayout architecture exactly. */}
                    </div>

                </form>

            </main>

            <MobileActionBar>
                <MobileActionBar.Secondary type="button" onClick={onCancel}>
                    Cancel
                </MobileActionBar.Secondary>
                <MobileActionBar.Primary type="submit" form="customer-form" disabled={isSubmitDisabled}>
                    {loading ? loadingText : submitText}
                </MobileActionBar.Primary>
            </MobileActionBar>
        </>
    );
}
