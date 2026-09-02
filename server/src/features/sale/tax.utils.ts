export const DEFAULT_VAT_RATE = 0.12;

export interface VatBreakdown {
    grossAmount: number;
    vatableSales: number;
    vatAmount: number;
    vatExemptSales: number;
    zeroRatedSales: number;
    taxRate: number;
}

/**
 * Calculates a standard Philippine 12% VAT-inclusive breakdown from a gross total amount.
 *
 * Formula:
 * - Gross (Display Price) = totalAmount
 * - VATable Sales = round(totalAmount / (1 + taxRate), 2)
 * - VAT Amount = round(totalAmount - VATable Sales, 2)
 *
 * @param totalAmount - The gross VAT-inclusive sales total.
 * @param taxRate - The applicable VAT rate (default: 0.12).
 * @returns An object containing grossAmount, vatableSales, vatAmount, vatExemptSales, zeroRatedSales, and taxRate.
 */
export function calculateVatInclusiveBreakdown(
    totalAmount: number,
    taxRate: number = DEFAULT_VAT_RATE
): VatBreakdown {
    const gross = Number(totalAmount) || 0;
    if (gross <= 0) {
        return {
            grossAmount: 0,
            vatableSales: 0,
            vatAmount: 0,
            vatExemptSales: 0,
            zeroRatedSales: 0,
            taxRate,
        };
    }

    const vatableSales = Math.round((gross / (1 + taxRate)) * 100) / 100;
    const vatAmount = Math.round((gross - vatableSales) * 100) / 100;

    return {
        grossAmount: gross,
        vatableSales,
        vatAmount,
        vatExemptSales: 0,
        zeroRatedSales: 0,
        taxRate,
    };
}
