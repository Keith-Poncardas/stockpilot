import { Prisma } from "@prisma/client";

export const buildSaleSearchQuery = (search?: string | null): Prisma.SaleWhereInput | undefined => {
    if (!search) return undefined;

    return {
        OR: search.trim().split(/\s+/).flatMap((word) => [
            { customer: { firstName: { contains: word, mode: "insensitive" } } },
            { customer: { lastName: { contains: word, mode: "insensitive" } } },
            { user: { firstName: { contains: word, mode: "insensitive" } } },
            { user: { lastName: { contains: word, mode: "insensitive" } } },
        ]),
    };
};
