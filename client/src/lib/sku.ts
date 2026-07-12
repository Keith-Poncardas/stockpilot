/**
 * Generates a SKU from a product name.
 *
 * Format: PREFIX-XXXXX
 *   - PREFIX: first 3 uppercase letters of the product name (non-alpha chars stripped)
 *   - XXXXX:  5 random alphanumeric characters (uppercase)
 *
 * Examples:
 *   "Stainless Steel Bottle" → "STA-K3F9P"
 *   "iPhone 15 Pro"         → "IPH-2XQ7R"
 */
export function generateSku(productName: string): string {
    const alpha = productName.replace(/[^a-zA-Z]/g, "").toUpperCase();
    const prefix = alpha.slice(0, 3).padEnd(3, "X");

    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const suffix = Array.from({ length: 5 }, () =>
        chars[Math.floor(Math.random() * chars.length)]
    ).join("");

    return `${prefix}-${suffix}`;
}
