import MainLayout from "../../components/layout/MainLayout";

const ProductInformationForm = () => {
  return (
    <MainLayout>
      <main class="flex-grow flex justify-center py-8 px-4 sm:px-6 lg:px-8">
        <div class="w-full max-w-[1024px] flex flex-col gap-8">
          {/* <!-- Breadcrumbs --> */}
          <nav class="flex text-sm text-slate-500 dark:text-slate-400">
            <ol class="flex items-center space-x-2">
              <li>
                <a class="hover:text-primary transition-colors" href="#">
                  Home
                </a>
              </li>
              <li>
                <span class="text-slate-300 dark:text-slate-600">/</span>
              </li>
              <li>
                <a class="hover:text-primary transition-colors" href="#">
                  Products
                </a>
              </li>
              <li>
                <span class="text-slate-300 dark:text-slate-600">/</span>
              </li>
              <li class="font-medium text-slate-900 dark:text-white">
                Create New
              </li>
            </ol>
          </nav>
          {/* <!-- Page Header --> */}
          <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div class="flex flex-col gap-1">
              <h1 class="text-3xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                Create New Product
              </h1>
              <p class="text-slate-500 dark:text-slate-400 text-lg">
                Enter product details to generate a QR documentation page.
              </p>
            </div>
            <div class="flex gap-3 shrink-0">
              <button class="px-5 h-11 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm">
                Cancel
              </button>
              <button class="px-5 h-11 rounded-lg bg-primary text-white font-bold text-sm hover:bg-blue-600 transition-colors shadow-sm flex items-center gap-2">
                <span class="material-symbols-outlined text-[20px]">save</span>
                Save Product
              </button>
            </div>
          </div>
          {/* <!-- Content Grid --> */}
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* <!-- Main Column --> */}
            <div class="lg:col-span-2 flex flex-col gap-8">
              {/* <!-- General Information Card --> */}
              <section class="bg-white dark:bg-[#1a202c] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div class="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
                  <h2 class="text-lg font-bold flex items-center gap-2">
                    <span class="material-symbols-outlined text-slate-400">
                      info
                    </span>
                    General Information
                  </h2>
                </div>
                <div class="p-6 space-y-6">
                  {/* <!-- Company Selection --> */}
                  <div>
                    <label class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      Company Context
                    </label>
                    <div class="relative">
                      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span class="material-symbols-outlined text-slate-400">
                          business
                        </span>
                      </div>
                      <input
                        class="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 bg-slate-50 dark:bg-slate-800 dark:border-slate-700 text-slate-500 dark:text-slate-400 text-sm font-medium cursor-not-allowed"
                        disabled=""
                        type="text"
                        value="Acme Corporation (Pre-filled)"
                      />
                    </div>
                  </div>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="space-y-2">
                      <label class="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                        Product Name <span class="text-red-500">*</span>
                      </label>
                      <input
                        class="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white dark:bg-slate-800 text-slate-900 dark:text-white transition-all outline-none"
                        placeholder="e.g. Smart Thermostat X1"
                        type="text"
                      />
                    </div>
                    <div class="space-y-2">
                      <label class="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                        Model Code (SKU)
                      </label>
                      <input
                        class="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white dark:bg-slate-800 text-slate-900 dark:text-white transition-all outline-none"
                        placeholder="e.g. ST-X1-2024"
                        type="text"
                      />
                    </div>
                  </div>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="space-y-2">
                      <label class="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                        Release Year
                      </label>
                      <select class="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white dark:bg-slate-800 text-slate-900 dark:text-white transition-all outline-none appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236b7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22M6%208l4%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem_1.25rem] bg-[right_0.5rem_center] bg-no-repeat pr-10">
                        <option disabled="" selected="" value="">
                          Select Year
                        </option>
                        <option value="2024">2024</option>
                        <option value="2023">2023</option>
                        <option value="2022">2022</option>
                        <option value="2021">2021</option>
                      </select>
                    </div>
                  </div>
                  <div class="space-y-4 pt-2">
                    <div class="space-y-2">
                      <label class="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                        Product Detail Page Link
                      </label>
                      <div class="flex">
                        <span class="inline-flex items-center px-3 text-sm text-slate-500 bg-slate-100 border border-r-0 border-slate-300 rounded-l-lg dark:bg-slate-700 dark:text-slate-400 dark:border-slate-600">
                          https://
                        </span>
                        <input
                          class="rounded-none rounded-r-lg bg-white border border-slate-300 text-slate-900 focus:ring-primary focus:border-primary block flex-1 min-w-0 w-full text-sm p-3 dark:bg-slate-800 dark:border-slate-600 dark:placeholder-slate-400 dark:text-white dark:focus:ring-primary dark:focus:border-primary outline-none"
                          placeholder="www.acme.com/product/x1"
                          type="text"
                        />
                      </div>
                    </div>
                    <div class="space-y-2">
                      <label class="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                        Public Store Link
                      </label>
                      <div class="flex">
                        <span class="inline-flex items-center px-3 text-sm text-slate-500 bg-slate-100 border border-r-0 border-slate-300 rounded-l-lg dark:bg-slate-700 dark:text-slate-400 dark:border-slate-600">
                          <span class="material-symbols-outlined text-[18px]">
                            shopping_cart
                          </span>
                        </span>
                        <input
                          class="rounded-none rounded-r-lg bg-white border border-slate-300 text-slate-900 focus:ring-primary focus:border-primary block flex-1 min-w-0 w-full text-sm p-3 dark:bg-slate-800 dark:border-slate-600 dark:placeholder-slate-400 dark:text-white dark:focus:ring-primary dark:focus:border-primary outline-none"
                          placeholder="store.acme.com/buy/x1"
                          type="text"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </section>
              {/* <!-- Manuals Repeater --> */}
              <section class="bg-white dark:bg-[#1a202c] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div class="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
                  <h2 class="text-lg font-bold flex items-center gap-2">
                    <span class="material-symbols-outlined text-slate-400">
                      menu_book
                    </span>
                    Manuals &amp; Documents
                  </h2>
                  <button class="text-primary text-sm font-bold hover:bg-primary/5 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1">
                    <span class="material-symbols-outlined text-[18px]">
                      add_circle
                    </span>
                    Add Manual
                  </button>
                </div>
                <div class="p-6 space-y-4">
                  {/* <!-- Item 1 --> */}
                  <div class="flex flex-col sm:flex-row gap-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 group">
                    <div class="w-full sm:w-1/3">
                      <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
                        Language
                      </label>
                      <select class="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm focus:border-primary outline-none">
                        <option>English (US)</option>
                        <option>Spanish (ES)</option>
                        <option>French (FR)</option>
                      </select>
                    </div>
                    <div class="flex-1">
                      <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
                        PDF URL
                      </label>
                      <input
                        class="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm focus:border-primary outline-none"
                        placeholder="https://..."
                        type="text"
                      />
                    </div>
                    <div class="flex items-end pb-1">
                      <button
                        class="text-slate-400 hover:text-red-500 transition-colors p-1"
                        title="Remove"
                      >
                        <span class="material-symbols-outlined">delete</span>
                      </button>
                    </div>
                  </div>
                  {/* <!-- Item 2 --> */}
                  <div class="flex flex-col sm:flex-row gap-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 group">
                    <div class="w-full sm:w-1/3">
                      <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
                        Language
                      </label>
                      <select class="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm focus:border-primary outline-none">
                        <option>German (DE)</option>
                        <option>English (US)</option>
                      </select>
                    </div>
                    <div class="flex-1">
                      <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
                        PDF URL
                      </label>
                      <input
                        class="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm focus:border-primary outline-none"
                        placeholder="https://..."
                        type="text"
                      />
                    </div>
                    <div class="flex items-end pb-1">
                      <button
                        class="text-slate-400 hover:text-red-500 transition-colors p-1"
                        title="Remove"
                      >
                        <span class="material-symbols-outlined">delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              </section>
              {/* <!-- FAQs Repeater --> */}
              <section class="bg-white dark:bg-[#1a202c] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div class="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
                  <h2 class="text-lg font-bold flex items-center gap-2">
                    <span class="material-symbols-outlined text-slate-400">
                      help_center
                    </span>
                    Frequently Asked Questions
                  </h2>
                  <button class="text-primary text-sm font-bold hover:bg-primary/5 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1">
                    <span class="material-symbols-outlined text-[18px]">
                      add_circle
                    </span>
                    Add FAQ
                  </button>
                </div>
                <div class="p-6 space-y-4">
                  {/* <!-- FAQ Item 1 --> */}
                  <div class="relative p-5 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-colors">
                    <button
                      class="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors"
                      title="Remove"
                    >
                      <span class="material-symbols-outlined text-[20px]">
                        close
                      </span>
                    </button>
                    <div class="space-y-4 pr-8">
                      <div class="space-y-1">
                        <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wide">
                          Question
                        </label>
                        <input
                          class="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm font-medium focus:border-primary outline-none"
                          placeholder="e.g. How do I reset the device?"
                          type="text"
                        />
                      </div>
                      <div class="space-y-1">
                        <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wide">
                          Answer
                        </label>
                        <textarea
                          class="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm focus:border-primary outline-none resize-none"
                          placeholder="Provide a detailed answer..."
                          rows="3"
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
            {/* <!-- Sidebar Column --> */}
            <div class="flex flex-col gap-8">
              {/* <!-- Customer Service Card --> */}
              <section class="bg-white dark:bg-[#1a202c] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div class="px-6 py-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
                  <h2 class="text-lg font-bold flex items-center gap-2">
                    <span class="material-symbols-outlined text-slate-400">
                      support_agent
                    </span>
                    Customer Service
                  </h2>
                </div>
                <div class="p-6 space-y-5">
                  <div class="space-y-2">
                    <label class="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Live Chat Link
                    </label>
                    <div class="relative">
                      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span class="material-symbols-outlined text-slate-400 text-[18px]">
                          chat
                        </span>
                      </div>
                      <input
                        class="w-full pl-9 pr-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                        placeholder="https://..."
                        type="text"
                      />
                    </div>
                  </div>
                  <div class="space-y-2">
                    <label class="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Support Email
                    </label>
                    <div class="relative">
                      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span class="material-symbols-outlined text-slate-400 text-[18px]">
                          mail
                        </span>
                      </div>
                      <input
                        class="w-full pl-9 pr-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                        placeholder="support@acme.com"
                        type="email"
                      />
                    </div>
                  </div>
                  <div class="space-y-2">
                    <label class="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Phone Number
                    </label>
                    <div class="relative">
                      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span class="material-symbols-outlined text-slate-400 text-[18px]">
                          call
                        </span>
                      </div>
                      <input
                        class="w-full pl-9 pr-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                        placeholder="+1 (555) 000-0000"
                        type="tel"
                      />
                    </div>
                  </div>
                  <div class="space-y-2">
                    <label class="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Operation Time
                    </label>
                    <div class="relative">
                      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span class="material-symbols-outlined text-slate-400 text-[18px]">
                          schedule
                        </span>
                      </div>
                      <input
                        class="w-full pl-9 pr-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                        placeholder="Mon-Fri, 9am - 6pm EST"
                        type="text"
                      />
                    </div>
                  </div>
                </div>
              </section>
              {/* <!-- Parts & Accessories Repeater (Compact Sidebar Version) --> */}
              <section class="bg-white dark:bg-[#1a202c] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div class="px-6 py-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 flex justify-between items-center">
                  <h2 class="text-lg font-bold flex items-center gap-2">
                    <span class="material-symbols-outlined text-slate-400">
                      extension
                    </span>
                    Parts
                  </h2>
                  <button class="text-primary text-xs font-bold hover:bg-primary/5 px-2 py-1 rounded-lg transition-colors flex items-center">
                    <span class="material-symbols-outlined text-[16px]">
                      add
                    </span>{" "}
                    Add
                  </button>
                </div>
                <div class="p-4 space-y-4">
                  {/* <!-- Part Item 1 --> */}
                  <div class="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-700">
                    <div class="flex justify-between items-start mb-2">
                      <label class="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Replacement Filter
                      </label>
                      <button class="text-slate-400 hover:text-red-500">
                        <span class="material-symbols-outlined text-[16px]">
                          close
                        </span>
                      </button>
                    </div>
                    <input
                      class="w-full px-2 py-1.5 text-xs rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 placeholder-slate-400 focus:border-primary outline-none"
                      placeholder="Store Link URL..."
                      type="text"
                    />
                  </div>
                  {/* <!-- Empty State / Placeholder --> */}
                  <div class="text-center py-4 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg">
                    <p class="text-xs text-slate-400">No more parts added.</p>
                  </div>
                </div>
              </section>
            </div>
          </div>
          {/* <!-- Bottom Action Bar (Mobile only, or extra convenience) --> */}
          <div class="flex sm:hidden justify-end gap-3 pb-8">
            <button class="flex-1 h-12 rounded-lg border border-slate-200 bg-white text-slate-700 font-bold text-sm">
              Cancel
            </button>
            <button class="flex-1 h-12 rounded-lg bg-primary text-white font-bold text-sm shadow-lg shadow-primary/30">
              Save Product
            </button>
          </div>
        </div>
      </main>
    </MainLayout>
  );
};

export default ProductInformationForm;
