import { Controller, useWatch, type Control } from 'react-hook-form';
import { NotebookPen } from 'lucide-react';
import { FormSection } from '@/components/ui/form-section';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Textarea } from '@/components/ui/textarea';
import type { AdjustStockFormValues } from '../../../types';

const MAX_NOTES = 250;

export interface NotesSectionProps {
    control: Control<AdjustStockFormValues>;
}

export function NotesSection({ control }: NotesSectionProps) {
    const notes = useWatch({ control, name: 'notes' }) ?? '';
    const charCount = notes.length;

    return (
        <FormSection
            title="Notes"
            description="Add additional context, e.g. location details or condition notes."
            icon={<NotebookPen className="h-4 w-4" strokeWidth={2} />}
            iconWrapperClassName="bg-slate-100 text-slate-600"
        >
            <Controller
                name="notes"
                control={control}
                rules={{
                    maxLength: {
                        value: MAX_NOTES,
                        message: `Notes must be ${MAX_NOTES} characters or less`,
                    },
                }}
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                        <div className="flex items-baseline justify-between gap-2">
                            <FieldLabel
                                htmlFor="sheet-notes-textarea"
                                className="text-[13px] font-semibold text-gray-700"
                            >
                                Notes <span className="font-normal text-slate-400">(optional)</span>
                            </FieldLabel>
                            <span
                                aria-live="polite"
                                aria-atomic="true"
                                className="text-xs text-slate-400 tabular-nums"
                            >
                                {charCount}/{MAX_NOTES}
                            </span>
                        </div>

                        <Textarea
                            {...field}
                            id="sheet-notes-textarea"
                            rows={3}
                            maxLength={MAX_NOTES}
                            placeholder="e.g. Discovered 3 extra units in aisle B4 during routine cycle count."
                            aria-invalid={fieldState.invalid}
                            className="resize-none mt-1"
                        />

                        {fieldState.invalid && (
                            <FieldError
                                errors={[fieldState.error]}
                                className="text-xs font-medium text-rose-600 mt-1"
                            />
                        )}
                    </Field>
                )}
            />
        </FormSection>
    );
}
