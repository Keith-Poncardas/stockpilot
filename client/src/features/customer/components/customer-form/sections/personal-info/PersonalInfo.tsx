import { User } from 'lucide-react';
import type { Control } from 'react-hook-form';
import { FormField } from '@/components/ui/form-field';
import { FormSection } from '@/components/ui/form-section';
import type { CustomerFormValues } from '../../../../validation';

interface PersonalInfoProps {
    control: Control<CustomerFormValues>;
}

export function PersonalInfo({ control }: PersonalInfoProps) {
    return (
        <FormSection
            title="Personal Information"
            description="Basic details about the customer"
            icon={<User className="w-4.5 h-4.5" strokeWidth={2} />}
            iconWrapperClassName="bg-purple-50 text-purple-600"
        >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                    <FormField
                        name="firstName"
                        control={control}
                        label="First Name"
                        placeholder="e.g. John"
                        required
                    />
                </div>
                <div>
                    <FormField
                        name="lastName"
                        control={control}
                        label="Last Name"
                        placeholder="e.g. Doe"
                        required
                    />
                </div>
                <div>
                    <FormField
                        name="phone"
                        control={control}
                        label={
                            <>
                                Phone Number <span className="text-slate-400 font-normal">(optional)</span>
                            </>
                        }
                        placeholder="e.g. 09123456789"
                        description="Must be unique if provided"
                    />
                </div>
                <div>
                    <FormField
                        name="email"
                        control={control}
                        type="email"
                        label={
                            <>
                                Email Address <span className="text-slate-400 font-normal">(optional)</span>
                            </>
                        }
                        placeholder="e.g. john@example.com"
                        description="Must be unique if provided"
                    />
                </div>
            </div>
        </FormSection>
    );
}
