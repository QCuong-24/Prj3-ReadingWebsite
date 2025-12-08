interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination = ({ page, totalPages, onPageChange }: PaginationProps) => {
  return (
    <div className="flex justify-center items-center gap-4 mt-8">
      <button
        disabled={page === 0}
        onClick={() => onPageChange(page - 1)}
        className={`px-4 py-2 rounded-lg text-white font-medium shadow transition
          ${page === 0 ? "bg-gray-300 cursor-not-allowed" : "bg-ocean-blue-500 hover:bg-ocean-blue-600"}
        `}
      >
        ← Previous
      </button>

      <span className="text-deep-space-blue-800 font-semibold">
        Page {page + 1} / {totalPages}
      </span>

      <button
        disabled={page + 1 >= totalPages}
        onClick={() => onPageChange(page + 1)}
        className={`px-4 py-2 rounded-lg text-white font-medium shadow transition
          ${page + 1 >= totalPages ? "bg-gray-300 cursor-not-allowed" : "bg-ocean-blue-500 hover:bg-ocean-blue-600"}
        `}
      >
        Next →
      </button>
    </div>
  );
};