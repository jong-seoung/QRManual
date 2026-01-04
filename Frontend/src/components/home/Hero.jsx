const Hero = () => {
  return (
    <div className="relative flex flex-col justify-center py-12 lg:py-20 px-4 lg:px-40 bg-background-light dark:bg-background-dark">
      <div className="flex flex-col max-w-[1280px] mx-auto w-full">
        <div className="@container">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            {/* <!-- Hero Content --> */}
            <div className="flex flex-col gap-6 lg:w-1/2">
              <h1 className="text-text-main dark:text-white text-4xl font-black leading-tight tracking-[-0.033em] lg:text-6xl">
                Turn Paper Manuals into{" "}
                <span className="text-primary">Digital Experiences</span>
              </h1>
              <p className="text-text-light dark:text-slate-400 text-lg font-normal leading-relaxed max-w-[600px]">
                The easiest way to host product documentation. Just upload your
                PDF, print a trackable QR code, and stick it on your product.
                Eliminate outdated manuals forever.
              </p>
              <div className="flex flex-wrap gap-3 mt-2">
                <button className="flex h-12 cursor-pointer items-center justify-center rounded-lg px-6 bg-primary hover:bg-primary-dark text-white text-base font-bold leading-normal tracking-[0.015em] transition-all shadow-lg shadow-primary/30">
                  <span className="truncate">Start for Free</span>
                </button>
                <button className="flex h-12 cursor-pointer items-center justify-center rounded-lg px-6 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-text-main dark:text-white text-base font-bold leading-normal tracking-[0.015em] transition-colors">
                  <span className="truncate flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">
                      play_circle
                    </span>{" "}
                    Request Demo
                  </span>
                </button>
              </div>
              <div className="flex items-center gap-2 text-sm text-text-light dark:text-slate-500 mt-2">
                <span className="material-symbols-outlined text-green-500 text-lg">
                  check_circle
                </span>
                <span>No credit card required</span>
                <span className="mx-2">•</span>
                <span className="material-symbols-outlined text-green-500 text-lg">
                  check_circle
                </span>
                <span>Cancel anytime</span>
              </div>
            </div>

            <div className="w-full lg:w-1/2">
              <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl bg-slate-100 dark:bg-slate-800 group">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuB6AmryB8b8pka4fi-8GnMsLmhjPRkyQi2CJcTzywnDJoE8AtV5xJJlIakY4rADbKWC9h24DZzF_Kc2mYs6zBOmzydBnhN0nxFnF46cdAx_KcLklxUVBFc3zDEsdigVM2JjvEoCAPsJI_PGPqyo4PenqXxCScwbRam002ADMRyWxYe1eo4FMMW0fn4Mb6J5NO6gV7XN6Cie6nih16dv4UtM15qvB4MuEMM_qtejCn-32_vQ956bh69QhJNWDaTM3_KFdhk-4Afr6SE")`,
                  }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
                  <div className="bg-white/95 backdrop-blur rounded-xl p-4 shadow-lg max-w-xs animate-bounce md:animate-none">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="size-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined">
                          description
                        </span>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-text-main">
                          User Manual v2.4.pdf
                        </p>
                        <p className="text-[10px] text-text-light">
                          Last updated: Just now
                        </p>
                      </div>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-primary w-2/3"></div>
                    </div>
                    <p className="text-[10px] text-right text-primary font-bold mt-1">
                      Downloading...
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
