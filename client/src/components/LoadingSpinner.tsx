import React from "react";

interface LoadingSpinnerProps {
    message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
    message = "Loading...",
}) => {
    return (
        <div className="flex flex-col items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-amber-500 border-t-transparent"></div>
            <p className="mt-3 text-sm text-gray-500">{message}</p>
        </div>
    );
};

export default LoadingSpinner;