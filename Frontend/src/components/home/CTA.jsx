const CTA = () => {
  return (
    <div class="py-20 px-4 lg:px-40 bg-white dark:bg-background-dark border-t border-slate-100 dark:border-slate-800">
      <div class="max-w-[800px] mx-auto text-center flex flex-col gap-8 items-center">
        <h2 class="text-3xl md:text-5xl font-black text-text-main dark:text-white tracking-tight">
          Ready to ditch the paper?
        </h2>
        <p class="text-lg text-text-light dark:text-slate-400">
          Join 5,000+ companies modernizing their product experience today.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 w-full justify-center">
          <button class="flex h-14 min-w-[200px] cursor-pointer items-center justify-center rounded-lg px-8 bg-primary hover:bg-primary-dark text-white text-lg font-bold shadow-xl shadow-primary/25 transition-all transform hover:-translate-y-1">
            Get Started Free
          </button>
          <button class="flex h-14 min-w-[200px] cursor-pointer items-center justify-center rounded-lg px-8 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-text-main dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700 text-lg font-bold transition-all">
            View Pricing
          </button>
        </div>
      </div>
    </div>
  );
};

export default CTA;
