import { useState } from "react";

const FilterAndSearch = () => {
  const [sortBy, setSortBy] = useState("latest");
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
      {/* <!-- Search --> */}
      <label className="flex flex-col h-10 w-full md:w-80 lg:w-96">
        <div className="flex w-full flex-1 items-stretch rounded-lg h-full border border-border-light dark:border-border-dark overflow-hidden focus-within:ring-2 focus-within:ring-primary/50 transition-shadow">
          <div className="text-text-secondary dark:text-gray-400 flex bg-surface-light dark:bg-surface-dark items-center justify-center pl-3 border-r-0">
            <span className="material-symbols-outlined">search</span>
          </div>
          <input
            className="flex w-full min-w-0 flex-1 resize-none border-none bg-surface-light dark:bg-surface-dark text-text-main dark:text-white focus:outline-0 h-full placeholder:text-text-secondary dark:placeholder:text-gray-500 px-3 text-sm font-normal leading-normal"
            placeholder="Search by name, model, or SKU..."
            value=""
          />
        </div>
      </label>
      <div className="relative flex gap-2 flex-wrap items-center">
        <button
          onClick={() => setOpen((prev) => !prev)}
          className="flex h-9 items-center justify-center gap-x-2 rounded-lg bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark hover:bg-gray-50 dark:hover:bg-gray-800 pl-4 pr-3 transition-colors"
        >
          <p className="text-text-main dark:text-white text-sm font-medium leading-normal">
            {sortBy === "latest" ? "최신순" : "인기순"}
          </p>
          <span className="material-symbols-outlined text-text-secondary text-lg">
            keyboard_arrow_down
          </span>
        </button>
        {open && (
          <div className="absolute top-full left-0 mt-2 w-36 rounded-lg border border-border-light dark:border-border-dark bg-white dark:bg-slate-800 shadow-lg z-10">
            <button
              onClick={() => {
                setSortBy("latest");
                setOpen(false);
              }}
              className="flex w-full items-center justify-between px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-slate-700"
            >
              최신순
              {sortBy === "latest" && (
                <span className="material-symbols-outlined text-sm">check</span>
              )}
            </button>

            <button
              onClick={() => {
                setSortBy("popular");
                setOpen(false);
              }}
              className="flex w-full items-center justify-between px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-slate-700"
            >
              인기순
              {sortBy === "popular" && (
                <span className="material-symbols-outlined text-sm">check</span>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterAndSearch;
