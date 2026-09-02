import { v2 as cloudinary, type UploadApiResponse } from "cloudinary";
import type { Readable } from "stream";

/**
 * Configure Cloudinary
 * Automatically reads CLOUDINARY_URL if present, or individual credentials.
 */
if (process.env.CLOUDINARY_URL) {
    cloudinary.config({
        cloudinary_url: process.env.CLOUDINARY_URL,
    });
} else {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
        secure: true,
    });
}

export interface CloudinaryUploadResult {
    url: string;
    secureUrl: string;
    publicId: string;
    format: string;
    width: number;
    height: number;
    bytes: number;
}

export interface UploadStreamOptions {
    folder?: string;
    publicId?: string;
    tags?: string[];
}

/**
 * Uploads a readable stream of an image directly to Cloudinary with
 * automatic optimization (WebP/AVIF auto-format, smart compression, and bounded dimensions).
 */
export async function uploadImageStream(
    stream: Readable,
    options?: UploadStreamOptions
): Promise<CloudinaryUploadResult> {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: options?.folder || "stockpilot/products",
                public_id: options?.publicId,
                tags: options?.tags || ["product", "stockpilot"],
                resource_type: "image",
                // Cloudinary automatic optimizations
                fetch_format: "auto",
                quality: "auto",
                // Restrict excessive resolution bounds to save bandwidth and storage
                width: 1200,
                height: 1200,
                crop: "limit",
            },
            (error, result: UploadApiResponse | undefined) => {
                if (error || !result) {
                    return reject(
                        new Error(
                            `Cloudinary upload failed: ${error?.message || "Unknown error"}`
                        )
                    );
                }
                resolve({
                    url: result.url,
                    secureUrl: result.secure_url,
                    publicId: result.public_id,
                    format: result.format,
                    width: result.width,
                    height: result.height,
                    bytes: result.bytes,
                });
            }
        );

        stream.pipe(uploadStream).on("error", (streamError) => {
            reject(
                new Error(
                    `Stream piping failed: ${streamError.message || "Unknown stream error"}`
                )
            );
        });
    });
}

/**
 * Deletes an image from Cloudinary by its public ID.
 */
export async function deleteImage(publicId: string): Promise<boolean> {
    try {
        if (!publicId) return false;
        const result = await cloudinary.uploader.destroy(publicId, {
            resource_type: "image",
        });
        return result.result === "ok";
    } catch (error) {
        console.error("Failed to delete image from Cloudinary:", error);
        return false;
    }
}

/**
 * Generates an on-the-fly optimized Cloudinary image delivery URL.
 */
export function getOptimizedImageUrl(
    url: string,
    options?: {
        width?: number;
        height?: number;
        crop?: string;
        quality?: string;
    }
): string {
    if (!url || !url.includes("res.cloudinary.com")) {
        return url;
    }

    const { width = 400, height = 400, crop = "fill", quality = "auto" } = options || {};
    const transformations = `f_auto,q_${quality},w_${width},h_${height},c_${crop}`;

    // Cloudinary standard delivery format: .../upload/[transformations]/v12345/folder/sample.jpg
    return url.replace("/upload/", `/upload/${transformations}/`);
}

export { cloudinary };
