const EcoImpact = () => {
  return (
    <div className="py-20 px-4 lg:px-40 overflow-hidden">
      <div className="max-w-[1280px] mx-auto rounded-3xl bg-green-50 dark:bg-green-900/20 p-8 lg:p-16 flex flex-col md:flex-row items-center gap-12 relative">
        {/* Decorative background blob */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-green-200/50 dark:bg-green-800/20 rounded-full blur-3xl -z-10 transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="w-full md:w-1/2 flex flex-col gap-6">
          <div className="inline-flex items-center gap-2 text-green-700 dark:text-green-400 font-bold uppercase tracking-wider text-sm">
            <span className="material-symbols-outlined">eco</span> Sustainability
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-text-main dark:text-white leading-tight">
            Save money.
            <br />
            Save the planet.
          </h2>
          <p className="text-text-light dark:text-slate-300 text-lg leading-relaxed">
            Moving to digital documentation significantly reduces your company's
            carbon footprint. Eliminate tons of paper waste and reduce shipping
            weight for every product you sell.
          </p>
          <div className="flex gap-8 mt-4">
            <div>
              <p className="text-3xl font-black text-green-600 dark:text-green-400">
                40%
              </p>
              <p classNameName="text-sm text-text-light dark:text-slate-400">
                Printing Cost Reduction
              </p>
            </div>
            <div>
              <p className="text-3xl font-black text-green-600 dark:text-green-400">
                100%
              </p>
              <p className="text-sm text-text-light dark:text-slate-400">
                Paper Waste Eliminated
              </p>
            </div>
          </div>
        </div>
        <div className="w-full md:w-1/2">
          <div className="relative w-full aspect-square md:aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
            <div
              className="absolute inset-0 bg-cover bg-center"
              data-alt="Abstract green leaves and technology mesh pattern representing eco-friendly tech"
              style={{
                    backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuDZwyu4u5-XNjSMcVYLzVNHFvrAEtjvJQmPZR4P_Qe3xtMJl5wjanWoVPrE2ipx-f7Xy3-oT8IvY8PfvmpPR9raNT0DL7H9R-O1mXbBr5bWAQHCEfGCcmk-2-_aaRxyz7JO1ejnYGA9ZrB8a7NP6sCb0WH-qOjo2XHUPgS70cFoD7A28IbZ-1yeTghrTWJr-ntTR7c5HsCAOzv_7UNUlJtD2lI5z8xxeTthb6XDA1h-4mXbrYB1-Evgiw-GysizVFCK7o4rgiLcY1M")`,
                  }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EcoImpact;
