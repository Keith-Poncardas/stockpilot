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
 * @param {(item: T) => string} params.getLabel A function to extract the display label from an item.
 * @param {(item: T) => string} [params.getColor] An optional function to extract a CSS color class name for the option.
 * @param {(value: string) => void} params.onUpdate The callback function to be invoked when an option is clicked.
 * @returns {Option[]} An array of Option objects representing the selectable items.
 */
export function getOptions<T>({
    items,
    currentValue,
    getValue,
    getLabel,
    getColor,
    onUpdate,
}: {
    items: readonly T[];
    currentValue: string;
    getValue: (item: T) => string;
    getLabel: (item: T) => string;
    getColor?: (item: T) => string;
    onUpdate: (value: string) => void;
}): Option[] {
    return items
        .filter(item => getValue(item) !== currentValue)
        .map(item => {
            const value = getValue(item);

            return {
                id: value,
                label: getLabel(item),
                colorClassName: getColor?.(item),
                onClick: () => onUpdate(value),
            };
        });
}