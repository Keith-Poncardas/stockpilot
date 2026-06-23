/**
 * MIN AND MAX REFINEMENT HELPER FUNCTIONS
 */
export function createMinMaxRefine<
    T extends Record<string, any>,
    K1 extends keyof T,
    K2 extends keyof T
>(
    minField: K1,
    maxField: K2
) {
    return (data: T) => {
        const min = data[minField];
        const max = data[maxField];

        if (min !== undefined && max !== undefined) {
            return min <= max;
        }

        return true;
    };
}

/**
 * MIN AND MAX REFINEMENT MESSAGE
 */
export const minMaxRefineMessage = (minField: string, maxField: string) => ({
    message: `${minField} must be less than or equal to ${maxField}`,
    path: [minField],
});