export interface AuthHeadingProps {
    title: string;
    description: string;
}

export function AuthHeading({ title, description }: AuthHeadingProps) {
    return (
        <>
            <h3 className="text-2xl font-bold text-gray-900 mb-1 text-center">
                {title}
            </h3>
            <p className="text-gray-500 text-sm mb-6 text-center">
                {description}
            </p>
        </>
    );
}
