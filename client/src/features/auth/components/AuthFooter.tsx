import { Link } from "react-router-dom";

export interface AuthFooterProps {
    text: string;
    linkText: string;
    linkTo: string;
}

export function AuthFooter({ text, linkText, linkTo }: AuthFooterProps) {
    return (
        <p className="text-sm text-center text-gray-500 mt-6">
            {text}{" "}
            <Link to={linkTo} className="text-amber-600 font-semibold hover:underline">
                {linkText}
            </Link>
        </p>
    );
}
