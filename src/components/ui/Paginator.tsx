import React from "react";

interface IProps {
  page: number;
  pageCount: number;
  total: number;
  isLoading: boolean;
  onClickPrev: () => void;
  onClickNext: () => void;
  onPageChange: (page: number) => void;
}

const Paginator: React.FC<IProps> = ({
  page,
  pageCount,
  onClickPrev,
  isLoading,
  total,
  onClickNext,
  onPageChange,
}) => {
  const renderPageNumbers = () => {
    const pageNumbers = [];

    if (pageCount <= 7) {
      for (let i = 1; i <= pageCount; i++) {
        pageNumbers.push(
          <button
            key={i}
            onClick={() => onPageChange(i)}
            className={`w-8 h-8 flex items-center justify-center rounded-full mx-1 ${
              i === page
                ? "bg-indigo-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {i}
          </button>
        );
      }
    } else {
      // Always show first two pages
      for (let i = 1; i <= 2; i++) {
        pageNumbers.push(
          <button
            key={i}
            onClick={() => onPageChange(i)}
            className={`w-8 h-8 flex items-center justify-center rounded-full mx-1 ${
              i === page
                ? "bg-indigo-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {i}
          </button>
        );
      }

      // Add dots if current page is not within first 3 or last 3 pages
      if (page > 3 && page < pageCount - 2) {
        pageNumbers.push(
          <span key="dots1" className="mx-1">
            ...
          </span>
        );
        pageNumbers.push(
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className="w-8 h-8 flex items-center justify-center rounded-full mx-1 bg-indigo-600 text-white"
          >
            {page}
          </button>
        );
        pageNumbers.push(
          <span key="dots2" className="mx-1">
            ...
          </span>
        );
      } else if (page <= 3) {
        pageNumbers.push(
          <button
            key={3}
            onClick={() => onPageChange(3)}
            className={`w-8 h-8 flex items-center justify-center rounded-full mx-1 ${
              3 === page
                ? "bg-indigo-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            3
          </button>
        );
        pageNumbers.push(
          <span key="dots" className="mx-1">
            ...
          </span>
        );
      } else {
        pageNumbers.push(
          <span key="dots" className="mx-1">
            ...
          </span>
        );
        pageNumbers.push(
          <button
            key={pageCount - 2}
            onClick={() => onPageChange(pageCount - 2)}
            className={`w-8 h-8 flex items-center justify-center rounded-full mx-1 ${
              pageCount - 2 === page
                ? "bg-indigo-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {pageCount - 2}
          </button>
        );
      }

      // Always show last two pages
      for (let i = pageCount - 1; i <= pageCount; i++) {
        pageNumbers.push(
          <button
            key={i}
            onClick={() => onPageChange(i)}
            className={`w-8 h-8 flex items-center justify-center rounded-full mx-1 ${
              i === page
                ? "bg-indigo-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {i}
          </button>
        );
      }
    }

    return pageNumbers;
  };

  return (
    <div className="flex-col justify-center items-center">
      <p className="text-sm text-gray-600 dark:text-gray-300 mx-3 flex items-center justify-center mb-2">
        Page{" "}
        <span className="mx-1 font-semibold text-lightText dark:text-darkText text-md-1">
          {page}
        </span>{" "}
        of
        <span className="mx-1 font-semibold text-lightText dark:text-darkText">
          {pageCount}
        </span>{" "}
        ({total} Records)
      </p>

      <div className="flex items-center justify-center">
        <button
          type="button"
          className="w-8 h-8 flex items-center justify-center rounded-full mx-1 bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
          disabled={page === 1 || isLoading}
          onClick={onClickPrev}
        >
          <svg
            className="w-4 h-4"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        {renderPageNumbers()}

        <button
          type="button"
          className="w-8 h-8 flex items-center justify-center rounded-full mx-1 bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
          disabled={page === pageCount || isLoading}
          onClick={onClickNext}
        >
          <svg
            className="w-4 h-4"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Paginator;
