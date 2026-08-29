import { FormSection } from '@/components/ui/form-section';
import { MapPin } from 'lucide-react';
import { resolveCityName, resolveProvinceName, resolveBarangayName } from '@/features/customer-refactor/utils';
import type { CustomerAddressSectionProps, AddressRowProps } from './types';
import { CustomerAddressSectionSkeleton } from './skeleton';

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
    const rawBarangay = customer.barangay ?? customer.barangayCode;

    const city = resolveCityName(rawCity);
    const province = resolveProvinceName(rawProvince);
    const barangay = resolveBarangayName(rawBarangay, rawCity);

    const hasAnyAddress = Boolean(
        customer.addressLine1 ||
        customer.addressLine2 ||
        barangay ||
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
                        <AddressRow label="Barangay" value={barangay} />
                        <AddressRow label="City / Municipality" value={city} />
                        <AddressRow label="Province / Area" value={province} />
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
