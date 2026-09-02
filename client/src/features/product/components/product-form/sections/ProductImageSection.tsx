import { ImageIcon } from 'lucide-react';
import { FormSection } from '@/components/ui/form-section';
import { ProductImageDropzone } from './ProductImageDropzone';

interface ProductImageSectionProps {
    stagedFile: File | null;
    onFileSelect: (file: File | null) => void;
    existingImageUrl?: string | null;
    onRemoveExisting?: () => void;
    isRemovedExisting?: boolean;
    disabled?: boolean;
}

export function ProductImageSection({
    stagedFile,
    onFileSelect,
    existingImageUrl,
    onRemoveExisting,
    isRemovedExisting = false,
    disabled = false,
}: ProductImageSectionProps) {
    return (
        <FormSection
            title="Product Image"
            description="Upload a single photo to identify this product in catalog and checkout"
            icon={<ImageIcon className="w-4.5 h-4.5" strokeWidth={2} />}
            iconWrapperClassName="bg-indigo-50 text-indigo-600"
        >
            <ProductImageDropzone
                stagedFile={stagedFile}
                onFileSelect={onFileSelect}
                existingImageUrl={existingImageUrl}
                onRemoveExisting={onRemoveExisting}
                isRemovedExisting={isRemovedExisting}
                disabled={disabled}
            />
        </FormSection>
    );
}

ProductImageSection.Skeleton = function ProductImageSectionSkeleton() {
    return (
        <FormSection
            title="Product Image"
            description="Upload a single photo to identify this product in catalog and checkout"
            icon={<ImageIcon className="w-4.5 h-4.5" strokeWidth={2} />}
            iconWrapperClassName="bg-indigo-50 text-indigo-600"
        >
            <div className="h-32 w-full bg-gray-100 animate-pulse rounded-xl border-2 border-dashed border-gray-200" />
        </FormSection>
    );
};
