import * as React from 'react';
import { MapPin } from 'lucide-react';
import { Controller, type Control, type UseFormSetValue, useWatch } from 'react-hook-form';
import { FormField } from '@/components/ui/form-field';
import { FormSection } from '@/components/ui/form-section';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { SelectFilter } from '@/components/ui/select-filter';
import { listProvinces, listMuncities } from '@jobuntux/psgc';

interface AddressInfoProps {
    control: Control<any>;
    setValue?: UseFormSetValue<any>;
}

export function AddressInfo({ control, setValue }: AddressInfoProps) {
    // Watch provinceCode to filter cities
    const selectedProvinceCode = useWatch({ control, name: 'provinceCode' });

    // Sort provinces alphabetically with provCode as value
    const provinceOptions = React.useMemo(() => {
        const provs = listProvinces();
        return provs
            .map(p => ({ value: p.provCode, label: p.provName }))
            .sort((a, b) => a.label.localeCompare(b.label));
    }, []);

    // Filter and sort cities based on selected province code
    const cityOptions = React.useMemo(() => {
        if (!selectedProvinceCode) return [];

        const cities = listMuncities(selectedProvinceCode);
        return cities
            .map(c => ({ value: c.munCityCode, label: c.munCityName.trim() }))
            .sort((a, b) => a.label.localeCompare(b.label));
    }, [selectedProvinceCode]);

    // Handle province change
    const handleProvinceChange = (newProvinceCode: string, onChange: (val: string) => void) => {
        onChange(newProvinceCode);
        // Reset cityCode and postalCode when province changes
        setValue?.('cityCode', '');
        setValue?.('postalCode', '');
    };

    // Handle city change
    const handleCityChange = (newCityCode: string, onChange: (val: string) => void) => {
        onChange(newCityCode);
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
                        placeholder="Street Name, Subdivision, Barangay"
                    />
                </div>
                <div>
                    <Controller
                        name="provinceCode"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel className="text-[13px] font-semibold text-gray-700 m-0">
                                    Province
                                </FieldLabel>
                                <SelectFilter
                                    value={field.value || ""}
                                    onChange={(val) => handleProvinceChange(val, field.onChange)}
                                    options={provinceOptions}
                                    className="w-full h-9"
                                    placeholder="Select a province"
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
                                    City/Municipality
                                </FieldLabel>
                                <SelectFilter
                                    value={field.value || ""}
                                    onChange={(val) => handleCityChange(val, field.onChange)}
                                    options={cityOptions}
                                    className="w-full h-9"
                                    disabled={!selectedProvinceCode}
                                    placeholder={!selectedProvinceCode ? "Select province first" : "Select a city"}
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
