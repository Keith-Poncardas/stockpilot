/**
 * Generates an on-the-fly optimized Cloudinary URL for client rendering.
 * Automatically injects auto-format (f_auto) and auto-quality (q_auto),
 * plus optional sizing and cropping.
 */
export function getOptimizedImageUrl(
    url?: string | null,
    options?: {
        width?: number;
        height?: number;
        crop?: 'fill' | 'limit' | 'scale' | 'thumb' | 'fit';
        quality?: string;
    }
): string {
    if (!url) return '';
    if (!url.includes('res.cloudinary.com')) return url;

    const { width, height, crop = 'fill', quality = 'auto' } = options || {};

    const parts: string[] = ['f_auto', `q_${quality}`];
    if (width) parts.push(`w_${width}`);
    if (height) parts.push(`h_${height}`);
    if (width || height) parts.push(`c_${crop}`);

    const transformations = parts.join(',');

    // Cloudinary standard upload format: .../upload/[existing_transformations/]v123456/sample.jpg
    return url.replace('/upload/', `/upload/${transformations}/`);
}
