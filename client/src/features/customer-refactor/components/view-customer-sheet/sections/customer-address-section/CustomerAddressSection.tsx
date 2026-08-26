import { FormSection } from '@/components/ui/form-section';
import { MapPin } from 'lucide-react';
import { listProvinces, listMuncities } from '@jobuntux/psgc';
import { psgc } from 'ph-locations';
import type { CustomerAddressSectionProps, AddressRowProps } from './types';
import { CustomerAddressSectionSkeleton } from './skeleton';

const { provinces: phProvinces, citiesMunicipalities: phCities } = psgc;

function resolvePsgcName(val?: string | null, type: 'city' | 'province' = 'city'): string | null {
    if (!val) return null;
    const clean = val.trim();
    if (type === 'province') {
        const p = listProvinces().find(p => p.provCode === clean || p.psgcCode === clean || p.provName.toLowerCase() === clean.toLowerCase());
        if (p) return p.provName;
        const phP = phProvinces.find(p => p.code === clean || p.name.toLowerCase() === clean.toLowerCase());
        return phP ? phP.name : val;
    }
    const c = listMuncities().find(c => c.munCityCode === clean || c.psgcCode === clean || c.munCityName.trim().toLowerCase() === clean.toLowerCase());
    if (c) return c.munCityName.trim();
    const phC = phCities.find(c => c.code === clean || c.name.toLowerCase() === clean.toLowerCase());
    return phC ? phC.name : val;
}

export function AddressRow({ label, value }: AddressRowProps) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2.5 border-b border-[#F0EEE9] last:border-0 gap-1 sm:gap-4">
            <span className="text-xs font-medium text-slate-500">{label}</span>
            <span className="text-sm font-semibold text-slate-900 sm:text-right font-mono">
                {value || '—'}
            </span>
        </div>
    );
}

export function CustomerAddressSection({ customer }: CustomerAddressSectionProps) {
    const rawCity = customer.city ?? customer.cityCode;
    const rawProvince = customer.province ?? customer.provinceCode;

    const city = resolvePsgcName(rawCity, 'city');
    const province = resolvePsgcName(rawProvince, 'province');

    const hasAnyAddress = Boolean(
        customer.addressLine1 ||
        customer.addressLine2 ||
        city ||
        province ||
        customer.postalCode ||
        customer.country
    );

    return (
        <FormSection
            title="Address Information"
            description="Registered billing or shipping location."
            icon={<MapPin className="w-4.5 h-4.5" strokeWidth={2} />}
            iconWrapperClassName="bg-amber-50 text-amber-600"
        >
            <div className="flex flex-col">
                {hasAnyAddress ? (
                    <>
                        <AddressRow label="Address Line 1" value={customer.addressLine1} />
                        <AddressRow label="Address Line 2" value={customer.addressLine2} />
                        <AddressRow label="City / Municipality" value={city} />
                        <AddressRow label="Province / State" value={province} />
                        <AddressRow label="Postal Code" value={customer.postalCode} />
                        <AddressRow label="Country" value={customer.country} />
                    </>
                ) : (
                    <p className="text-sm text-slate-400 py-4 text-center font-mono">No address on file.</p>
                )}
            </div>
        </FormSection>
    );
}

CustomerAddressSection.Skeleton = CustomerAddressSectionSkeleton;
