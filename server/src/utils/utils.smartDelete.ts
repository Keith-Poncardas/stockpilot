import { Prisma } from "@prisma/client";
import { prisma } from "@/lib";

type PrismaTransactionClient = Prisma.TransactionClient;

/** A single "history check" — counts rows from one table that reference the entity. */
export interface HistoryCheck {
    /** Human-readable label for debugging (not used at runtime). */
    label: string;
    /**
     * Return the count of related rows that constitute "business history".
     * Receives the outer prisma client so you can include soft-deleted rows
     * intentionally (as with stock movements on products).
     */
    count: (id: string) => Promise<number>;
}

/** What to do when the entity has NO business history (safe to hard-delete). */
export interface HardDeleteOptions {
    /**
     * Steps executed inside a single transaction.
     * Delete dependents first, then the entity itself.
     */
    execute: (tx: PrismaTransactionClient, id: string) => Promise<void>;
}

/** What to do when the entity HAS business history (must be soft-deleted). */
export interface SoftDeleteOptions {
    /**
     * Perform the soft-delete (archive).  Runs outside a transaction unless
     * you wrap it yourself, since it's typically a single update.
     */
    execute: (id: string) => Promise<void>;
}

export interface SmartDeleteOptions {
    /** The entity's resolved UUID (already validated). */
    id: string;

    /**
     * One or more async checks.  If the total count across ALL checks is > 0,
     * the entity is considered "used" and will be soft-deleted (if supported).
     */
    historyChecks: HistoryCheck[];

    /**
     * Soft-delete configuration.
     * Omit entirely for entities that support hard-delete only (e.g. User).
     * If omitted and history exists, an error is thrown to prevent silent data loss.
     */
    softDelete?: SoftDeleteOptions;

    /** Hard-delete configuration — always required. */
    hardDelete: HardDeleteOptions;
}

export type SmartDeleteAction = "ARCHIVED" | "DELETED";
export interface SmartDeleteResult {
    action: SmartDeleteAction;
}

/**
 * Reusable "smart delete" helper.
 *
 * Decision logic:
 *   1. Run all `historyChecks` in parallel.
 *   2. If any count > 0 AND `softDelete` is configured → soft-delete → return `{ action: "ARCHIVED" }`.
 *   3. If any count > 0 AND `softDelete` is NOT configured → throw (caller should guard against this before calling).
 *   4. If all counts === 0 → hard-delete inside a transaction → return `{ action: "DELETED" }`.
 *
 * @example — Product (supports both soft & hard delete)
 * ```ts
 * return smartDelete({
 *     id,
 *     historyChecks: [
 *         { label: "saleItems",      count: (id) => prisma.saleItem.count({ where: { productId: id } }) },
 *         { label: "stockMovements", count: (id) => prisma.stockMovement.count({ where: { productId: id } }) },
 *     ],
 *     softDelete: {
 *         execute: (id) => prisma.product.update({ where: { id }, data: { isActive: false, deletedAt: new Date() } }),
 *     },
 *     hardDelete: {
 *         execute: async (tx, id) => {
 *             await tx.inventory.deleteMany({ where: { productId: id } });
 *             await tx.product.delete({ where: { id } });
 *         },
 *     },
 * });
 * ```
 *
 * @example — User (hard-delete only, caller guards history externally)
 * ```ts
 * return smartDelete({
 *     id,
 *     historyChecks: [
 *         { label: "sales",          count: (id) => prisma.sale.count({ where: { userId: id } }) },
 *         { label: "stockMovements", count: (id) => prisma.stockMovement.count({ where: { userId: id } }) },
 *     ],
 *     hardDelete: {
 *         execute: async (tx, id) => {
 *             await tx.user.delete({ where: { id } });
 *         },
 *     },
 * });
 * ```
 */
export async function smartDelete(
    options: SmartDeleteOptions
): Promise<SmartDeleteResult> {
    const { id, historyChecks, softDelete, hardDelete } = options;

    // Run all history checks concurrently
    const counts = await Promise.all(
        historyChecks.map(({ count }) => count(id))
    );

    const hasHistory = counts.some((c) => c > 0);

    if (hasHistory) {
        if (!softDelete) {
            // Caller is responsible for guarding this path.
            // This branch should only be reached if the caller intentionally
            // allows hard-delete on an entity with history, which is unsafe.
            throw new Error(
                `[smartDelete] Entity "${id}" has business history but no softDelete handler was provided. ` +
                `Guard against this before calling smartDelete, or provide a softDelete option.`
            );
        }

        await softDelete.execute(id);
        return { action: "ARCHIVED" };
    }

    // No history — safe to hard-delete
    await prisma.$transaction((tx) => hardDelete.execute(tx, id));
    return { action: "DELETED" };
}
