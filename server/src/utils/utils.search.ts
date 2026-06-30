/**
 * Utility to generate a Prisma search filter (AND/OR) for given fields.
 * It splits the search string into words and ensures ALL words are present
 * in AT LEAST ONE of the specified fields.
 * 
 * @param search - The search string
 * @param fields - An array of field names to search against. 
 *                 By default, uses 'contains'. You can specify 'equals' like 'id:equals'.
 * @returns Prisma-compatible WHERE clause fragment
 */
export const buildSearchQuery = (search: string | undefined | null, fields: string[]) => {
    if (!search || search.trim() === '') return undefined;

    return {
        AND: search.trim().split(/\s+/).map((word) => ({
            OR: fields.map((field) => {
                const [fieldName, operator = 'contains'] = field.split(':');
                return {
                    [fieldName]: {
                        [operator]: word,
                        mode: "insensitive"
                    }
                };
            })
        }))
    };
};
