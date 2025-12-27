/**
 * Pagination Component
 */

interface PaginationProps {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    onPageChange?: (page: number) => void;
    onLimitChange?: (limit: number) => void;
    itemLabel?: string;
    limitOptions?: number[];
    maxButtons?: number;
}

export function Pagination({
    page,
    limit,
    total,
    totalPages,
    onPageChange,
    onLimitChange,
    itemLabel = 'items',
    limitOptions = [5, 10, 20, 50],
    maxButtons = 7,
}: PaginationProps) {
    const getPageList = (): (number | '...')[] => {
        if (totalPages <= maxButtons) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        const pages = new Set<number>();
        
        pages.add(1);
        pages.add(totalPages);

        const windowSize = maxButtons - 2;
        
        let left = Math.max(2, page - Math.floor(windowSize / 2));
        let right = Math.min(totalPages - 1, left + windowSize - 1);
        if (right >= totalPages - 1) {
            right = totalPages - 1;
            left = Math.max(2, right - windowSize + 1);
        }
        if (left <= 2) {
            left = 2;
            right = Math.min(totalPages - 1, left + windowSize - 1);
        }

        for (let i = left; i <= right; i++) {
            pages.add(i);
        }

        const sorted = Array.from(pages).sort((a, b) => a - b);
        const result: (number | '...')[] = [];

        for (let i = 0; i < sorted.length; i++) {
            if (i > 0 && sorted[i] - sorted[i - 1] > 1) {
                result.push('...');
            }
            result.push(sorted[i]);
        }

        return result;
    };

    const showingFrom = total > 0 ? (page - 1) * limit + 1 : 0;
    const showingTo = Math.min(page * limit, total);

    return (
        <div className="m-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
                {onLimitChange && (
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Show</span>
                        <select
                            value={limit}
                            onChange={(e) => onLimitChange(Number(e.target.value))}
                            className="px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm"
                        >
                            {limitOptions.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                        <span className="text-sm text-gray-600">entries</span>
                    </div>
                )}
                <p className="text-sm text-gray-600">
                    Showing {showingFrom} to {showingTo} of {total} {itemLabel}
                </p>
            </div>

            <div className="flex gap-2">
                <button
                    onClick={() => onPageChange?.(page - 1)}
                    disabled={page <= 1}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Previous
                </button>

                {getPageList().map((p, idx) =>
                    p === '...' ? (
                        <span
                            key={`ellipsis-${idx}`}
                            className="px-3 py-2 text-gray-400 select-none"
                        >
                            ...
                        </span>
                    ) : (
                        <button
                            key={`page-${p}`}
                            onClick={() => onPageChange?.(p)}
                            className={`px-4 py-2 rounded-lg transition-colors ${
                                p === page
                                    ? 'bg-yellow-400 text-[#10142C] font-semibold'
                                    : 'border border-gray-300 hover:bg-gray-50'
                            }`}
                        >
                            {p}
                        </button>
                    )
                )}

                <button
                    onClick={() => onPageChange?.(page + 1)}
                    disabled={page >= totalPages || totalPages === 0}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Next
                </button>
            </div>
        </div>
    );
}

export default Pagination;
