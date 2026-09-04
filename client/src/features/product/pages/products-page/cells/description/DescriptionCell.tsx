import type { Row } from '@tanstack/react-table';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import type { IProduct } from '../../../../types';

interface DescriptionCellProps {
    row: Row<IProduct>;
}

const MAX_WORDS = 24;
const MAX_CHARS = 60;

function truncateText(
    text: string,
    maxWords = MAX_WORDS,
    maxChars = MAX_CHARS
): { displayedText: string; isTruncated: boolean } {
    const trimmed = text.trim();
    if (!trimmed) {
        return { displayedText: '', isTruncated: false };
    }

    const words = trimmed.split(/\s+/);
    const exceedsWords = words.length > maxWords;
    const exceedsChars = trimmed.length > maxChars;

    if (!exceedsWords && !exceedsChars) {
        return { displayedText: trimmed, isTruncated: false };
    }

    // Slice up to maxWords
    let candidate = words.slice(0, maxWords).join(' ');

    // Also clamp to maxChars
    if (candidate.length > maxChars) {
        candidate = candidate.slice(0, maxChars).trim();
    }

    return {
        displayedText: `${candidate.trim()}...`,
        isTruncated: true,
    };
}

export function DescriptionCell({ row }: DescriptionCellProps) {
    const description = row.original.description;

    if (!description) {
        return (
            <div className="text-xs text-slate-400 italic py-1">
                No description provided
            </div>
        );
    }

    const { displayedText, isTruncated } = truncateText(description);

    if (!isTruncated) {
        return (
            <div className="text-xs text-slate-600 leading-relaxed break-words whitespace-pre-line max-w-[280px] py-1">
                {description}
            </div>
        );
    }

    return (
        <TooltipProvider delayDuration={200}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <div className="text-xs text-slate-600 leading-relaxed break-words whitespace-pre-line max-w-[280px] py-1 cursor-default hover:text-slate-900 transition-colors">
                        <span>{displayedText}</span>
                    </div>
                </TooltipTrigger>
                <TooltipContent
                    side="top"
                    align="start"
                    className="flex flex-col items-start gap-1 max-w-xs p-3 bg-slate-900 text-slate-100 border border-slate-800 rounded-xl shadow-xl z-50 text-left"
                >
                    <p className="font-semibold text-slate-400 text-[10px] uppercase tracking-wider">
                        Full Description
                    </p>
                    <p className="text-xs text-slate-200 leading-relaxed break-words whitespace-pre-line">
                        {description}
                    </p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
