/**
 * Represents the configuration properties for an individual DatePicker input.
 */
export interface DatePickerConfigItem {
    value: string | undefined;
    onChange: (val: string | undefined) => void;
    placeholder: string;
};
