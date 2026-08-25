/**
 * Represents the configuration properties for an individual DatePicker input.
 */
export interface DatePickerConfigItem {
    value: string | undefined;
    onChange: (val: any) => void;
    placeholder: string;
};
