import { useFormState } from "react-hook-form";
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
    handleSubmit: any;
    control: any;
    setValue?: any;
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
                <div className="max-w-3xl mx-auto">
                    {error && (
                        <div className="mb-6">
                            <Alert variant="error">
                                {error}
                            </Alert>
                        </div>
                    )}

                    <form
                        id="customer-form"
                        onSubmit={handleSubmit(onSubmit)}
                        className="flex flex-col gap-6 max-sm:mb-15"
                    >
                        <PersonalInfo control={control as any} />
                        <AddressInfo control={control as any} setValue={setValue} />
                    </form>
                </div>
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
