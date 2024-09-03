interface IProps {
  page: number;
  pageCount: number;
  total: number;
  isLoading: boolean;
  onClickPrev: () => void;
  onClickNext: () => void;
}

const Paginator = ({
  page,
  pageCount,
  onClickPrev,
  isLoading,
  total,
  onClickNext,
}: IProps) => {
  return (
    <div className="flex-col justify-center items-center">
      <p className="text-sm text-gray-600 dark:text-gray-300 mx-3 flex items-center justify-center mb-2">
        Page{" "}
        <span className="mx-1 font-semibold text-lightText dark:text-darkText text-md-1">
          {page}
        </span>{" "}
        to
        <span className="mx-1 font-semibold text-lightText dark:text-darkText">
          {pageCount}
        </span>{" "}
        of
        <span className="mx-1 font-semibold text-lightText dark:text-darkText">
          {total}
        </span>{" "}
        Records
      </p>

      <div className="flex items-center justify-center">
        <button
          type="button"
          className="bg-gray-800 dark:bg-gray-300 text-white dark:text-lightText rounded-l-md border-l border border-gray-100 flex items-center justify-center px-4 h-10  text-base font-medium  hover:bg-indigo-600 hover:text-white dark:hover:text-white  dark:border-gray-700  dark:hover:bg-indigo-600  disabled:bg-gray-400 dark:disabled:bg-gray-500 dark:disabled:text-white disabled:hover:bg-gray-400
          disabled:cursor-not-allowed duration-300"
          disabled={page === 1 || isLoading}
          onClick={onClickPrev}
        >
          <svg
            className="w-3.5 h-3.5 me-2 rtl:rotate-180"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 10"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 5H1m0 0 4 4M1 5l4-4"
            />
          </svg>
          Previous
        </button>
        <button
          type="button"
          className="bg-gray-800 dark:bg-gray-300 text-white dark:text-lightText rounded-r-md border-r border border-gray-100 flex items-center justify-center px-4 h-10 me-3 text-base font-medium  hover:bg-indigo-600 hover:text-white dark:hover:text-white  dark:border-gray-700  dark:hover:bg-indigo-600  disabled:bg-gray-400 dark:disabled:bg-gray-500 dark:disabled:text-white disabled:hover:bg-gray-400
          disabled:cursor-not-allowed duration-300"
          disabled={page === pageCount || isLoading}
          onClick={onClickNext}
        >
          Next
          <svg
            className="w-3.5 h-3.5 ms-2 rtl:rotate-180"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 10"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 5h12m0 0L9 1m4 4L9 9"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Paginator;
