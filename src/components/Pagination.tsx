import React from 'react';
import { ChevronDown } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isDark: boolean;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  isDark,
}) => {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pageNumbers: (number | string)[] = [];

    if (totalPages <= 7) {
      // Show all pages if 7 or fewer
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always show first page
      pageNumbers.push(1);

      if (currentPage > 3) {
        pageNumbers.push('ellipsis-start');
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pageNumbers.push(i);
      }

      if (currentPage < totalPages - 2) {
        pageNumbers.push('ellipsis-end');
      }

      // Always show last page
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 relative z-10">
      <div
        className={`flex justify-center items-center gap-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
      >
        {/* Previous Button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`p-2.5 rounded-lg font-medium transition-all ${
            isDark
              ? 'bg-white/5 hover:bg-white/10 border border-white/10 disabled:opacity-30 disabled:cursor-not-allowed'
              : 'bg-gray-100 hover:bg-gray-200 border border-gray-300 disabled:opacity-30 disabled:cursor-not-allowed'
          }`}
          aria-label="Previous page"
        >
          <ChevronDown className="w-5 h-5 rotate-90" />
        </button>

        {/* Page Numbers */}
        <div className="flex items-center gap-1">
          {getPageNumbers().map((pageNum) => {
            if (typeof pageNum === 'string') {
              return (
                <span
                  key={pageNum}
                  className={`px-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}
                >
                  ...
                </span>
              );
            }

            return (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={`min-w-[40px] h-[40px] rounded-lg font-medium transition-all ${
                  pageNum === currentPage
                    ? isDark
                      ? 'bg-white/5 border-2 border-[#d4a574] text-[#d4a574]'
                      : 'bg-white border-2 border-[#b8894d] text-[#b8894d]'
                    : isDark
                      ? 'bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300'
                      : 'bg-gray-100 hover:bg-gray-200 border border-gray-300 text-gray-700'
                }`}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        {/* Next Button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`p-2.5 rounded-lg font-medium transition-all ${
            isDark
              ? 'bg-gradient-to-r from-[#d4a574] to-[#a3784e] text-white hover:translate-y-[-1px] hover:shadow-lg hover:shadow-[#d4a574]/30 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:translate-y-0'
              : 'bg-gradient-to-r from-[#b8894d] to-[#8b6635] text-white hover:translate-y-[-1px] hover:shadow-lg hover:shadow-[#b8894d]/30 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:translate-y-0'
          }`}
          aria-label="Next page"
        >
          <ChevronDown className="w-5 h-5 -rotate-90" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
