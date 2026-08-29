import * as React from 'react';
import { MapPin } from 'lucide-react';
import { Controller, type Control, type UseFormSetValue, useWatch } from 'react-hook-form';
import { FormField } from '@/components/ui/form-field';
import { FormSection } from '@/components/ui/form-section';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { SelectFilter } from '@/components/ui/select-filter';
import {
    getProvinceOptions,
    getCityOptions,
    getBarangayOptions,
} from '@/features/customer-refactor/utils';

interface AddressInfoProps {
    control: Control<any>;
    setValue?: UseFormSetValue<any>;
}

export function AddressInfo({ control, setValue }: AddressInfoProps) {
    // Watch provinceCode and cityCode
    const selectedProvinceCode = useWatch({ control, name: 'provinceCode' });
    const selectedCityCode = useWatch({ control, name: 'cityCode' });

    // 1. Province options (Metro Manila at the top + 81 real provinces)
    const provinceOptions = React.useMemo(() => {
        return getProvinceOptions();
    }, []);

    // 2. City options (all 17 NCR cities if Metro Manila, or provincial cities/municipalities)
    const cityOptions = React.useMemo(() => {
        return getCityOptions(selectedProvinceCode);
    }, [selectedProvinceCode]);

    // 3. Barangay options for selected city
    const barangayOptions = React.useMemo(() => {
        return getBarangayOptions(selectedCityCode);
    }, [selectedCityCode]);

    // Handle province change: reset city, barangay, and postal code
    const handleProvinceChange = (newProvinceCode: string, onChange: (val: string) => void) => {
        onChange(newProvinceCode);
        setValue?.('cityCode', '', { shouldValidate: true, shouldDirty: true });
        setValue?.('barangayCode', '', { shouldValidate: true, shouldDirty: true });
        setValue?.('postalCode', '', { shouldValidate: true, shouldDirty: true });
    };

    // Handle city change: reset barangay
    const handleCityChange = (newCityCode: string, onChange: (val: string) => void) => {
        onChange(newCityCode);
        setValue?.('barangayCode', '', { shouldValidate: true, shouldDirty: true });
    };

    return (
        <FormSection
            title="Address Information"
            description="Where the customer is located"
            icon={<MapPin className="w-4.5 h-4.5" strokeWidth={2} />}
            iconWrapperClassName="bg-green-50 text-green-600"
        >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="sm:col-span-2">
                    <FormField
                        name="addressLine1"
                        control={control}
                        label={
                            <>
                                Address Line 1 <span className="text-slate-400 font-normal">(optional)</span>
                            </>
                        }
                        placeholder="House/Unit/Flr #, Bldg Name, Blk or Lot #"
                    />
                </div>
                <div className="sm:col-span-2">
                    <FormField
                        name="addressLine2"
                        control={control}
                        label={
                            <>
                                Address Line 2 <span className="text-slate-400 font-normal">(optional)</span>
                            </>
                        }
                        placeholder="Street Name, Subdivision, Purok"
                    />
                </div>
                <div>
                    <Controller
                        name="provinceCode"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel className="text-[13px] font-semibold text-gray-700 m-0">
                                    Province / Area
                                </FieldLabel>
                                <SelectFilter
                                    value={field.value || ""}
                                    onChange={(val) => handleProvinceChange(val, field.onChange)}
                                    options={provinceOptions}
                                    className="w-full h-9"
                                    placeholder="Select a province or area"
                                />
                                {fieldState.invalid && (
                                    <FieldError
                                        errors={[fieldState.error]}
                                        className="text-xs font-medium text-rose-600"
                                    />
                                )}
                            </Field>
                        )}
                    />
                </div>
                <div>
                    <Controller
                        name="cityCode"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel className="text-[13px] font-semibold text-gray-700 m-0">
                                    City / Municipality
                                </FieldLabel>
                                <SelectFilter
                                    value={field.value || ""}
                                    onChange={(val) => handleCityChange(val, field.onChange)}
                                    options={cityOptions}
                                    className="w-full h-9"
                                    disabled={!selectedProvinceCode}
                                    placeholder={
                                        !selectedProvinceCode
                                            ? "Select province/area first"
                                            : "Select a city / municipality"
                                    }
                                />
                                {fieldState.invalid && (
                                    <FieldError
                                        errors={[fieldState.error]}
                                        className="text-xs font-medium text-rose-600"
                                    />
                                )}
                            </Field>
                        )}
                    />
                </div>
                <div>
                    <Controller
                        name="barangayCode"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel className="text-[13px] font-semibold text-gray-700 m-0">
                                    Barangay
                                </FieldLabel>
                                <SelectFilter
                                    value={field.value || ""}
                                    onChange={field.onChange}
                                    options={barangayOptions}
                                    className="w-full h-9"
                                    disabled={!selectedCityCode}
                                    placeholder={
                                        !selectedCityCode
                                            ? "Select city first"
                                            : "Select a barangay"
                                    }
                                />
                                {fieldState.invalid && (
                                    <FieldError
                                        errors={[fieldState.error]}
                                        className="text-xs font-medium text-rose-600"
                                    />
                                )}
                            </Field>
                        )}
                    />
                </div>
                <div>
                    <FormField
                        name="postalCode"
                        control={control}
                        label={
                            <>
                                Postal Code <span className="text-slate-400 font-normal">(optional)</span>
                            </>
                        }
                        placeholder="e.g. 1000"
                    />
                </div>
            </div>
        </FormSection>
    );
}
