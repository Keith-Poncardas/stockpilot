import * as React from 'react';
import { MapPin } from 'lucide-react';
import { Controller, type Control, type UseFormSetValue, useWatch } from 'react-hook-form';
import { FormField } from '@/components/ui/form-field';
import { FormSection } from '@/components/ui/form-section';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { SelectFilter } from '@/components/ui/select-filter';
import { provinces, citiesMunicipalities as cities } from 'ph-locations';

interface AddressInfoProps {
    control: Control<any>;
    setValue?: UseFormSetValue<any>;
}

export function AddressInfo({ control, setValue }: AddressInfoProps) {
    // Watch province to filter cities
    const selectedProvince = useWatch({ control, name: 'province' });

    // Sort provinces alphabetically
    const provinceOptions = React.useMemo(() => {
        return provinces.map(p => ({ value: p.name, label: p.name })).sort((a, b) => a.label.localeCompare(b.label));
    }, []);

    // Filter and sort cities based on selected province
    const cityOptions = React.useMemo(() => {
        if (!selectedProvince) return [];
        const provinceData = provinces.find(p => p.name === selectedProvince);
        if (!provinceData) return [];

        return cities
            .filter(c => c.province === provinceData.code)
            .map(c => ({ value: c.name, label: c.name }))
            .sort((a, b) => a.label.localeCompare(b.label));
    }, [selectedProvince]);

    // Handle province change
    const handleProvinceChange = (newProvince: string, onChange: (val: string) => void) => {
        onChange(newProvince);
        // Reset city and postal code when province changes
        setValue?.('city', '');
        setValue?.('postalCode', '');
    };

    // Handle city change
    const handleCityChange = (newCity: string, onChange: (val: string) => void) => {
        onChange(newCity);
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
                        name="province"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel className="text-[13px] font-semibold text-gray-700 m-0">
                                    Province <span className="text-slate-400 font-normal">(optional)</span>
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
                        name="city"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel className="text-[13px] font-semibold text-gray-700 m-0">
                                    City/Municipality <span className="text-slate-400 font-normal">(optional)</span>
                                </FieldLabel>
                                <SelectFilter
                                    value={field.value || ""}
                                    onChange={(val) => handleCityChange(val, field.onChange)}
                                    options={cityOptions}
                                    className="w-full h-9"
                                    disabled={!selectedProvince}
                                    placeholder={!selectedProvince ? "Select province first" : "Select a city"}
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
                <div>
                    <FormField
                        name="country"
                        control={control}
                        label="Country"
                        disabled
                    />
                </div>
            </div>
        </FormSection>
    );
}
