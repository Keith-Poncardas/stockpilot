import type { Option } from "./types";

/**
 * Generates an array of selectable options based on a provided list of items,
 * excluding the currently selected value.
 * 
 * @template T The type of the items in the list.
 * @param {Object} params The parameters for generating options.
 * @param {readonly T[]} params.items The list of items to generate options from.
 * @param {string} params.currentValue The currently selected value, which will be excluded from the generated options.
 * @param {(item: T) => string} params.getValue A function to extract the unique value/ID from an item.
 * @param {Record<string, string>} [params.labelConfig] An optional configuration object mapping values to display labels.
 * @param {Record<string, string>} [params.colorConfig] An optional configuration object mapping values to CSS color class names.
 * @param {(value: string) => void} params.onUpdate The callback function to be invoked when an option is clicked.
 * @returns {Option[]} An array of Option objects representing the selectable items.
 */
export function getOptions<T>({
    items,
    currentValue,
    getValue,
    labelConfig,
    colorConfig,
    onUpdate,
}: {
    items: readonly T[];
    currentValue: string;
    getValue: (item: T) => string;
    labelConfig?: Record<string, string>;
    colorConfig?: Record<string, string>;
    onUpdate: (value: string) => void;
}): Option[] {
    return items
        .filter(item => getValue(item) !== currentValue)
        .map(item => {
            const value = getValue(item);

            return {
                id: value,
                label: labelConfig?.[value] || String(value).replace(/_/g, ' '),
                colorClassName: colorConfig ? (colorConfig[value] || colorConfig['DEFAULT']) : undefined,
                onClick: () => onUpdate(value),
            };
        });
}