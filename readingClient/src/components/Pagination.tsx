import { useState, useEffect } from "react";

interface PaginationProps {
  page: number; // 0-based index
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination = ({ page, totalPages, onPageChange }: PaginationProps) => {
  const [jumpValue, setJumpValue] = useState("");
  const currentPage = page + 1; // 1-based for UI

  // Sync jumpValue if page changes from outside
  useEffect(() => {
    setJumpValue("");
  }, [page]);

  const handleJump = () => {
    const val = parseInt(jumpValue);
    if (!isNaN(val) && val >= 1 && val <= totalPages) {
      onPageChange(val - 1);
    }
    setJumpValue("");
  };

  const generatePageNumbers = () => {
    const pages: (number | string)[] = [];
    pages.push(1);
    if (currentPage > 3) pages.push("...");
    
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      if (!pages.includes(i)) pages.push(i);
    }

    if (currentPage < totalPages - 2) pages.push("...");
    if (totalPages > 1 && !pages.includes(totalPages)) pages.push(totalPages);
    
    return pages;
  };

  return (
    <div className="flex flex-col items-center gap-4 mt-8">
      {/* Top Row: Page Numbers */}
      <div className="flex items-center gap-2">
        <button
          disabled={page === 0}
          onClick={() => onPageChange(page - 1)}
          className={`px-3 py-1 rounded transition ${
            page === 0 ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-ocean-blue-500 text-white hover:bg-ocean-blue-600"
          }`}
        >
          &lt;
        </button>

        {generatePageNumbers().map((num, idx) => (
          <button
            key={idx}
            disabled={typeof num !== "number"}
            onClick={() => typeof num === "number" && onPageChange(num - 1)}
            className={`px-3 py-1 rounded min-w-[32px] transition ${
              num === currentPage
                ? "bg-ocean-blue-600 text-white font-bold"
                : typeof num === "number"
                ? "bg-ocean-blue-50 text-ocean-blue-700 hover:bg-ocean-blue-100"
                : "bg-transparent text-gray-400 cursor-default"
            }`}
          >
            {num}
          </button>
        ))}

        <button
          disabled={page + 1 >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className={`px-3 py-1 rounded transition ${
            page + 1 >= totalPages ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-ocean-blue-500 text-white hover:bg-ocean-blue-600"
          }`}
        >
          &gt;
        </button>
      </div>

      {/* Bottom Row: Jump to Page */}
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <span>Go to page:</span>
        <input
          type="number"
          value={jumpValue}
          onChange={(e) => setJumpValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleJump()}
          min={1}
          max={totalPages}
          className="w-16 p-1 border rounded text-center focus:ring-1 focus:ring-ocean-blue-500 outline-none"
          placeholder={`${currentPage}`}
        />
        <button
          onClick={handleJump}
          className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-ocean-blue-500 hover:text-white transition font-medium border"
        >
          Go
        </button>
      </div>
    </div>
  );
};