const OurProduct = () => {
  return (
    <div class="py-20 px-4 lg:px-40 bg-slate-50 dark:bg-slate-900/50">
      <div class="max-w-[1100px] mx-auto">
        <div class="mb-12">
          <h2 class="text-3xl font-bold text-text-main dark:text-white mb-4">
            Everything you need to manage docs
          </h2>
          <p class="text-text-light dark:text-slate-400 max-w-2xl">
            Enterprise-grade features designed for hardware manufacturers,
            consumer electronics, and industrial equipment.
          </p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div class="flex gap-4 items-start">
            <div class="shrink-0 size-10 rounded-lg bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center text-primary border border-slate-200 dark:border-slate-700">
              <span class="material-symbols-outlined">update</span>
            </div>
            <div>
              <h4 class="font-bold text-text-main dark:text-white mb-1">
                Always Up-to-Date
              </h4>
              <p class="text-sm text-text-light dark:text-slate-400">
                Push updates to your manuals instantly without recalling
                products or re-printing labels.
              </p>
            </div>
          </div>
          {/* Feature 2 */}
          <div class="flex gap-4 items-start">
            <div class="shrink-0 size-10 rounded-lg bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center text-primary border border-slate-200 dark:border-slate-700">
              <span class="material-symbols-outlined">analytics</span>
            </div>
            <div>
              <h4 class="font-bold text-text-main dark:text-white mb-1">
                Scan Analytics
              </h4>
              <p class="text-sm text-text-light dark:text-slate-400">
                Track where and when your customers are accessing documentation.
                Identify popular products.
              </p>
            </div>
          </div>
          {/* Feature 3 */}
          <div class="flex gap-4 items-start">
            <div class="shrink-0 size-10 rounded-lg bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center text-primary border border-slate-200 dark:border-slate-700">
              <span class="material-symbols-outlined">translate</span>
            </div>
            <div>
              <h4 class="font-bold text-text-main dark:text-white mb-1">
                Multi-language Support
              </h4>
              <p class="text-sm text-text-light dark:text-slate-400">
                Automatically serve the correct language PDF based on the user's
                phone settings.
              </p>
            </div>
          </div>
          {/* Feature 4 */}
          <div class="flex gap-4 items-start">
            <div class="shrink-0 size-10 rounded-lg bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center text-primary border border-slate-200 dark:border-slate-700">
              <span class="material-symbols-outlined">history</span>
            </div>
            <div>
              <h4 class="font-bold text-text-main dark:text-white mb-1">
                Version History
              </h4>
              <p class="text-sm text-text-light dark:text-slate-400">
                Keep an archive of past manual versions. Allow users to select
                their specific model year.
              </p>
            </div>
          </div>
          {/* Feature 5 */}
          <div class="flex gap-4 items-start">
            <div class="shrink-0 size-10 rounded-lg bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center text-primary border border-slate-200 dark:border-slate-700">
              <span class="material-symbols-outlined">palette</span>
            </div>
            <div>
              <h4 class="font-bold text-text-main dark:text-white mb-1">
                Custom Branding
              </h4>
              <p class="text-sm text-text-light dark:text-slate-400">
                Customize the landing page where your PDF is hosted with your
                logo and colors.
              </p>
            </div>
          </div>
          {/* Feature 6 */}
          <div class="flex gap-4 items-start">
            <div class="shrink-0 size-10 rounded-lg bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center text-primary border border-slate-200 dark:border-slate-700">
              <span class="material-symbols-outlined">lock</span>
            </div>
            <div>
              <h4 class="font-bold text-text-main dark:text-white mb-1">
                Secure Access
              </h4>
              <p class="text-sm text-text-light dark:text-slate-400">
                Optional password protection for sensitive service manuals meant
                only for technicians.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OurProduct;
