const SocialProof = () => {
  return (
    <div className="bg-slate-50 dark:bg-slate-900/50 border-y border-slate-100 dark:border-slate-800 py-10">
      <div className="max-w-[1280px] mx-auto px-4 lg:px-40 text-center">
        <p className="text-text-light dark:text-slate-500 text-sm font-bold uppercase tracking-wider mb-8">
          Trusted by innovative hardware companies
        </p>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
          <div className="text-xl font-black text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <span className="material-symbols-outlined">deployed_code</span>{" "}
            NEXUS
          </div>
          <div className="text-xl font-black text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <span className="material-symbols-outlined">
              precision_manufacturing
            </span>{" "}
            ForgeInd
          </div>
          <div className="text-xl font-black text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <span className="material-symbols-outlined">bolt</span> Voltic
          </div>
          <div className="text-xl font-black text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <span className="material-symbols-outlined">waves</span> AeroFlow
          </div>
          <div className="text-xl font-black text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <span className="material-symbols-outlined">smart_toy</span>{" "}
            RoboTech
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialProof;
