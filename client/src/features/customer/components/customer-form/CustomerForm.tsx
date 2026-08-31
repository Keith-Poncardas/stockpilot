import { PersonalInfo, AddressInfo } from './sections';
import type { CustomerFormProps } from './types';

export function CustomerForm({
    id = 'customer-form',
    control,
    setValue,
    onSubmit,
    className = 'flex flex-col gap-6',
}: CustomerFormProps) {
    return (
        <form id={id} onSubmit={onSubmit} className={className}>
            <PersonalInfo control={control} />
            <AddressInfo control={control} setValue={setValue} />
        </form>
    );
}
