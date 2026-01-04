import productInformationStore from "../../store/productInformationStore";

const Pagination = () => {
  const {
    page,
    totalPages,
    totalElements,
    size,
    first,
    last,
    getAllProductInformation,
  } = productInformationStore();

  const start = page * size + 1;
  const end = Math.min((page + 1) * size, totalElements);

  // 현재 페이지 기준 ±2 페이지
  const range = 2;
  let from = page - range;
  let to = page + range;

  if (from < 0) {
    to += Math.abs(from);
    from = 0;
  }
  if (to > totalPages - 1) {
    from -= to - (totalPages - 1);
    to = totalPages - 1;
    if (from < 0) from = 0;
  }

  const pageNumbers = [];
  for (let i = from; i <= to; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t border-border-light dark:border-border-dark bg-gray-50/50 dark:bg-surface-dark gap-4">
      {/* 보여지는 항목 정보 */}
      <span className="text-sm text-text-secondary dark:text-gray-400">
        Showing{" "}
        <span className="font-medium text-text-main dark:text-white">{start}</span>{" "}
        to{" "}
        <span className="font-medium text-text-main dark:text-white">{end}</span>{" "}
        of{" "}
        <span className="font-medium text-text-main dark:text-white">{totalElements}</span>{" "}
        products
      </span>

      {/* 페이지 버튼 */}
      <div className="flex items-center gap-2">
        {/* 이전 ±5 버튼 */}
        <button
          className="flex items-center justify-center size-8 rounded-lg border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark text-text-secondary dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={first}
          onClick={() =>
            getAllProductInformation(Math.max(0, page - 5), size)
          }
        >
          <span className="material-symbols-outlined text-lg">chevron_left</span>
        </button>

        {/* 맨 처음 페이지 버튼 */}
        {from > 0 && (
          <>
            <button
              className="flex items-center justify-center size-8 rounded-lg border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark text-text-main dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 font-medium text-sm transition-colors"
              onClick={() => getAllProductInformation(0, size)}
            >
              1
            </button>
            {from > 1 && <span className="px-1 text-text-secondary dark:text-gray-400">...</span>}
          </>
        )}

        {/* 현재 ±2 페이지 버튼 */}
        {pageNumbers.map((num) => (
          <button
            key={num}
            className={`flex items-center justify-center size-8 rounded-lg px-3 font-medium text-sm transition-colors ${
              num === page
                ? "bg-primary text-white"
                : "border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark text-text-main dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
            onClick={() => getAllProductInformation(num, size)}
          >
            {num + 1}
          </button>
        ))}

        {/* 마지막 페이지 버튼 */}
        {to < totalPages - 1 && (
          <>
            {to < totalPages - 2 && <span className="px-1 text-text-secondary dark:text-gray-400">...</span>}
            <button
              className="flex items-center justify-center size-8 rounded-lg border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark text-text-main dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 font-medium text-sm transition-colors"
              onClick={() => getAllProductInformation(totalPages - 1, size)}
            >
              {totalPages}
            </button>
          </>
        )}

        {/* 다음 ±5 버튼 */}
        <button
          className="flex items-center justify-center size-8 rounded-lg border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark text-text-secondary dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={last}
          onClick={() =>
            getAllProductInformation(Math.min(totalPages - 1, page + 5), size)
          }
        >
          <span className="material-symbols-outlined text-lg">chevron_right</span>
        </button>
      </div>
    </div>
  );
};

export default Pagination;
