import React, { useState, useRef, useEffect, useCallback } from 'react';
import { UploadCloud, Image as ImageIcon, Trash2, RefreshCw, FileCheck2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { getOptimizedImageUrl } from '@/lib/cloudinary';

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];

interface ProductImageDropzoneProps {
    stagedFile: File | null;
    onFileSelect: (file: File | null) => void;
    existingImageUrl?: string | null;
    onRemoveExisting?: () => void;
    isRemovedExisting?: boolean;
    disabled?: boolean;
}

export function ProductImageDropzone({
    stagedFile,
    onFileSelect,
    existingImageUrl,
    onRemoveExisting,
    isRemovedExisting = false,
    disabled = false,
}: ProductImageDropzoneProps) {
    const [isDragOver, setIsDragOver] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Create object URL for local file preview and clean it up on unmount or change
    useEffect(() => {
        if (!stagedFile) {
            setPreviewUrl(null);
            return;
        }

        const objectUrl = URL.createObjectURL(stagedFile);
        setPreviewUrl(objectUrl);

        return () => {
            URL.revokeObjectURL(objectUrl);
        };
    }, [stagedFile]);

    const handleFileValidation = useCallback(
        (file: File): boolean => {
            if (!ALLOWED_TYPES.includes(file.type)) {
                toast.error('Invalid file type', {
                    description: 'Please upload a JPG, PNG, or WebP image.',
                });
                return false;
            }

            if (file.size > MAX_FILE_SIZE_BYTES) {
                toast.error('File is too large', {
                    description: 'Maximum image size is 5MB.',
                });
                return false;
            }

            return true;
        },
        []
    );

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && handleFileValidation(file)) {
            onFileSelect(file);
        }
        // Reset input value so re-selecting the same file triggers change
        if (e.target) {
            e.target.value = '';
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (disabled) return;
        setIsDragOver(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);
        if (disabled) return;

        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            const file = files[0];
            if (handleFileValidation(file)) {
                onFileSelect(file);
            }
        }
    };

    const handleRemove = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (stagedFile) {
            onFileSelect(null);
        } else if (existingImageUrl && onRemoveExisting) {
            onRemoveExisting();
        }
    };

    const handleTriggerBrowse = () => {
        if (!disabled) {
            fileInputRef.current?.click();
        }
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes < 1024 * 1024) {
            return `${(bytes / 1024).toFixed(1)} KB`;
        }
        return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    };

    // Determine current display image (staged local preview vs existing cloud image)
    const activePreviewUrl = previewUrl || (!isRemovedExisting ? existingImageUrl : null);
    const hasImage = Boolean(activePreviewUrl);
    const isNewFile = Boolean(stagedFile);

    return (
        <div className="w-full space-y-2">
            <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                className="hidden"
                onChange={handleFileInputChange}
                disabled={disabled}
            />

            {hasImage && activePreviewUrl ? (
                /* Enhanced Image Preview Card */
                <div className="relative group rounded-xl border border-slate-200 bg-gradient-to-b from-slate-50 to-slate-100/60 p-3.5 transition-all hover:border-slate-300">
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                        {/* Thumbnail Viewport */}
                        <div className="relative w-28 h-28 sm:w-24 sm:h-24 rounded-lg overflow-hidden border border-slate-200/80 bg-white shadow-2xs shrink-0 flex items-center justify-center">
                            <img
                                src={isNewFile ? activePreviewUrl : getOptimizedImageUrl(activePreviewUrl, { width: 240, height: 240, crop: 'fill' })}
                                alt="Product preview"
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* Metadata & Actions */}
                        <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5 text-center sm:text-left">
                            <div>
                                <div className="flex items-center justify-center sm:justify-start gap-2">
                                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                                        <FileCheck2 className="w-3 h-3 text-emerald-600" />
                                        {isNewFile ? 'Ready to Upload' : 'Current Product Image'}
                                    </span>
                                </div>
                                <p className="text-sm font-semibold text-slate-800 truncate mt-1.5" title={stagedFile?.name || 'product-image'}>
                                    {stagedFile ? stagedFile.name : 'Uploaded to Cloudinary'}
                                </p>
                                <p className="text-xs text-slate-500 font-mono mt-0.5">
                                    {stagedFile ? `${formatFileSize(stagedFile.size)} • ${stagedFile.type.replace('image/', '').toUpperCase()}` : 'Cloud Optimized (f_auto, q_auto)'}
                                </p>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center justify-center sm:justify-start gap-2 mt-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={handleTriggerBrowse}
                                    disabled={disabled}
                                    className="h-8 text-xs font-medium text-slate-700 hover:bg-white gap-1.5"
                                >
                                    <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                                    Change Image
                                </Button>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleRemove}
                                    disabled={disabled}
                                    className="h-8 text-xs font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-50 gap-1.5"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    Remove
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                /* Interactive Drag & Drop Area */
                <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={handleTriggerBrowse}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleTriggerBrowse();
                        }
                    }}
                    className={cn(
                        'relative flex flex-col items-center justify-center p-6 rounded-xl border-2 border-dashed transition-all duration-150 cursor-pointer outline-none select-none',
                        isDragOver
                            ? 'border-blue-500 bg-blue-50/60 ring-4 ring-blue-500/10'
                            : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/60 bg-white',
                        disabled && 'opacity-60 pointer-events-none'
                    )}
                >
                    <div
                        className={cn(
                            'w-12 h-12 rounded-xl flex items-center justify-center transition-colors mb-3',
                            isDragOver ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'
                        )}
                    >
                        {isDragOver ? (
                            <UploadCloud className="w-6 h-6 animate-bounce" strokeWidth={1.8} />
                        ) : (
                            <ImageIcon className="w-6 h-6" strokeWidth={1.8} />
                        )}
                    </div>

                    <div className="text-center space-y-1">
                        <p className="text-xs sm:text-sm font-semibold text-slate-800">
                            <span className="text-blue-600 hover:underline">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-slate-500 font-normal">
                            PNG, JPG, or WEBP (Max 5MB) • 1 image per product
                        </p>
                    </div>

                    {isRemovedExisting && (
                        <p className="mt-2 text-[11px] font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                            Previous image will be removed upon saving
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}
