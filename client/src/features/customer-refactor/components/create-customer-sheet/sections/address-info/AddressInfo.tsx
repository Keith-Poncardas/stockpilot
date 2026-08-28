import * as React from 'react';
import { MapPin } from 'lucide-react';
import { Controller, type Control, type UseFormSetValue, useWatch } from 'react-hook-form';
import { FormField } from '@/components/ui/form-field';
import { FormSection } from '@/components/ui/form-section';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { SelectFilter } from '@/components/ui/select-filter';
import { listProvinces, listMuncities, listBarangays } from '@jobuntux/psgc';

interface AddressInfoProps {
    control: Control<any>;
    setValue?: UseFormSetValue<any>;
}

export function AddressInfo({ control, setValue }: AddressInfoProps) {
    // Watch provinceCode and cityCode
    const selectedProvinceCode = useWatch({ control, name: 'provinceCode' });
    const selectedCityCode = useWatch({ control, name: 'cityCode' });

    // Sort provinces alphabetically, stripping "City of " for display
    const provinceOptions = React.useMemo(() => {
        const provs = listProvinces();
        return provs
            .map(p => {
                const originalName = p.provName.trim();
                const isCity = originalName.startsWith('City of');
                const cleanName = isCity ? originalName.replace('City of ', '').trim() : originalName;
                return {
                    value: p.provCode,
                    label: cleanName,
                    isCity,
                    originalName
                };
            })
            .sort((a, b) => a.label.localeCompare(b.label));
    }, []);

    const selectedProvince = React.useMemo(() => {
        return provinceOptions.find(p => p.value === selectedProvinceCode);
    }, [selectedProvinceCode, provinceOptions]);

    // Filter and sort cities based on selected province code
    const cityOptions = React.useMemo(() => {
        if (!selectedProvinceCode) return [];

        const cities = listMuncities(selectedProvinceCode);
        return cities
            .map(c => ({ value: c.munCityCode, label: c.munCityName.trim() }))
            .sort((a, b) => a.label.localeCompare(b.label));
    }, [selectedProvinceCode]);

    // Filter and sort barangays based on selected city code
    const barangayOptions = React.useMemo(() => {
        if (selectedProvince?.isCity) {
            // If it's an independent city (e.g. Manila, Pasig), fetch barangays for all its municipalities (districts)
            const cities = listMuncities(selectedProvinceCode);
            const allBarangays = cities.flatMap(c => listBarangays(c.munCityCode));
            return allBarangays
                .map(b => ({ value: b.brgyCode, label: b.brgyName.trim() }))
                .sort((a, b) => a.label.localeCompare(b.label));
        }

        if (!selectedCityCode) return [];

        const barangays = listBarangays(selectedCityCode);
        return barangays
            .map(b => ({ value: b.brgyCode, label: b.brgyName.trim() }))
            .sort((a, b) => a.label.localeCompare(b.label));
    }, [selectedCityCode, selectedProvince, selectedProvinceCode]);

    // Handle province change
    const handleProvinceChange = (newProvinceCode: string, onChange: (val: string) => void) => {
        onChange(newProvinceCode);

        const prov = provinceOptions.find(p => p.value === newProvinceCode);

        if (prov?.isCity) {
            // Auto-select the city if the province is an independent city
            const cities = listMuncities(newProvinceCode);
            // Fallback to the first city if exact match isn't found
            const mainCity = cities.find(c => c.munCityName.trim() === prov.originalName) || cities[0];
            if (mainCity) {
                setValue?.('cityCode', mainCity.munCityCode, { shouldValidate: true, shouldDirty: true });
            } else {
                setValue?.('cityCode', '', { shouldValidate: true, shouldDirty: true });
            }
        } else {
            // Reset cityCode when normal province changes
            setValue?.('cityCode', '', { shouldValidate: true, shouldDirty: true });
        }

        // Always reset barangay and postal code on province change
        setValue?.('barangayCode', '', { shouldValidate: true, shouldDirty: true });
        setValue?.('postalCode', '', { shouldValidate: true, shouldDirty: true });
    };

    // Handle city change
    const handleCityChange = (newCityCode: string, onChange: (val: string) => void) => {
        onChange(newCityCode);
        // Reset barangayCode when city changes
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
                                    disabled={!selectedProvinceCode || selectedProvince?.isCity}
                                    placeholder={
                                        !selectedProvinceCode
                                            ? "Select province first"
                                            : selectedProvince?.isCity
                                                ? "City auto-selected"
                                                : "Select a city"
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
                                    disabled={!selectedProvince?.isCity && !selectedCityCode}
                                    placeholder={(!selectedProvince?.isCity && !selectedCityCode) ? "Select city first" : "Select a barangay"}
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
