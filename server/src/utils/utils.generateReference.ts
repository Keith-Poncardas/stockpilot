import { format } from "date-fns";
import { Prisma, PrismaClient } from "@prisma/client";
import { prisma as globalPrisma } from "@/lib";

/**
 * Extracts the sequence number from a generated reference string.
 *
 * @param reference The reference string (e.g., 'ADJ-20260723-0001')
 * @returns The sequence number, or 0 if invalid/missing
 */
export function extractSequenceFromReference(reference: string | null | undefined): number {
    if (!reference) return 0;

    const parts = reference.split("-");
    if (parts.length !== 3) return 0;

    const sequence = parseInt(parts[2], 10);
    return isNaN(sequence) ? 0 : sequence;
}

/**
 * Generates the next auto-incrementing daily reference string.
 *
 * Queries the `stockMovement` table for the latest reference matching
 * `<prefix>-<YYYYMMDD>-*`, extracts its sequence number, and returns
 * the next one.  Pass the current Prisma transaction client (`tx`) so
 * the lookup stays within the same atomic operation.
 *
 * Format : PREFIX-YYYYMMDD-NNNN
 * Examples: ADJ-20260723-0001 → ADJ-20260723-0002
 *           SALE-20260723-0001
 *
 * @param prefix   Transaction type prefix (e.g. "ADJ", "SALE", "PO")
 * @param tx       Prisma client or transaction client (defaults to global prisma)
 * @param padding  Zero-padding width for the sequence (default: 4)
 * @returns        The formatted reference string
 */
export async function generateReference(
    prefix: string,
    tx: Prisma.TransactionClient | PrismaClient = globalPrisma,
    padding: number = 4
): Promise<string> {
    const today = new Date();
    const dateStr = format(today, "yyyyMMdd");
    const prefixDate = `${prefix}-${dateStr}`;

    const last = await tx.stockMovement.findFirst({
        where: {
            reference: { startsWith: prefixDate },
        },
        orderBy: { createdAt: "desc" },
        select: { reference: true },
    });

    const nextSeq = extractSequenceFromReference(last?.reference) + 1;
    return `${prefixDate}-${nextSeq.toString().padStart(padding, "0")}`;
}
