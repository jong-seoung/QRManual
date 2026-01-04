const FilterAndSearch = () => {
  return (
    <div class="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
      {/* <!-- Search --> */}
      <label class="flex flex-col h-10 w-full md:w-80 lg:w-96">
        <div class="flex w-full flex-1 items-stretch rounded-lg h-full border border-border-light dark:border-border-dark overflow-hidden focus-within:ring-2 focus-within:ring-primary/50 transition-shadow">
          <div class="text-text-secondary dark:text-gray-400 flex bg-surface-light dark:bg-surface-dark items-center justify-center pl-3 border-r-0">
            <span class="material-symbols-outlined">search</span>
          </div>
          <input
            class="flex w-full min-w-0 flex-1 resize-none border-none bg-surface-light dark:bg-surface-dark text-text-main dark:text-white focus:outline-0 h-full placeholder:text-text-secondary dark:placeholder:text-gray-500 px-3 text-sm font-normal leading-normal"
            placeholder="Search by name, model, or SKU..."
            value=""
          />
        </div>
      </label>
      <div class="flex gap-2 flex-wrap items-center">
        <button class="flex h-9 items-center justify-center gap-x-2 rounded-lg bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark hover:bg-gray-50 dark:hover:bg-gray-800 pl-4 pr-3 transition-colors">
          <p class="text-text-main dark:text-white text-sm font-medium leading-normal">
            Manufacturer
          </p>
          <span class="material-symbols-outlined text-text-secondary text-lg">
            keyboard_arrow_down
          </span>
        </button>
        <button class="flex h-9 items-center justify-center gap-x-2 rounded-lg bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark hover:bg-gray-50 dark:hover:bg-gray-800 pl-4 pr-3 transition-colors">
          <p class="text-text-main dark:text-white text-sm font-medium leading-normal">
            Year
          </p>
          <span class="material-symbols-outlined text-text-secondary text-lg">
            keyboard_arrow_down
          </span>
        </button>
        <button class="flex h-9 items-center justify-center gap-x-2 rounded-lg bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark hover:bg-gray-50 dark:hover:bg-gray-800 pl-4 pr-3 transition-colors">
          <p class="text-text-main dark:text-white text-sm font-medium leading-normal">
            Badge
          </p>
          <span class="material-symbols-outlined text-text-secondary text-lg">
            keyboard_arrow_down
          </span>
        </button>
      </div>
    </div>
  );
};

export default FilterAndSearch;
