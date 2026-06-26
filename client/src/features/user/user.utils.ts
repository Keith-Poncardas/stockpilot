
type Option = {
    id: string;
    label: string;
    colorClassName?: string;
    onClick: () => void;
};

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