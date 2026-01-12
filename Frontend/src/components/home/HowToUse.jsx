const HowToUse = () => {
  return (
    <div className="py-20 px-4 lg:px-40">
      <div className="max-w-[960px] mx-auto flex flex-col gap-12">
        <div className="flex flex-col gap-4 text-center items-center">
          <span className="text-primary font-bold tracking-wider uppercase text-sm bg-primary/10 px-3 py-1 rounded-full">
            Process
          </span>
          <h2 className="text-text-main dark:text-white text-3xl font-bold leading-tight md:text-4xl max-w-[720px]">
            How DocuQR Works
          </h2>
          <p className="text-text-light dark:text-slate-400 text-base font-normal leading-normal max-w-[600px]">
            Three simple steps to modernize your product manuals and delight
            your customers.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Step 1 */}
          <div className="flex flex-col gap-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 hover:shadow-xl hover:border-primary/50 transition-all duration-300 group">
            <div className="size-12 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-3xl">
                cloud_upload
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-text-main dark:text-white text-lg font-bold">
                1. Upload PDF
              </h3>
              <p className="text-text-light dark:text-slate-400 text-sm leading-relaxed">
                Upload your existing user manual or documentation to our secure
                cloud platform. We support PDF, DOCX, and video links.
              </p>
            </div>
          </div>
          {/* Step 2 */}
          <div className="flex flex-col gap-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 hover:shadow-xl hover:border-primary/50 transition-all duration-300 group">
            <div className="size-12 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-3xl">
                qr_code_2
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-text-main dark:text-white text-lg font-bold">
                2. Generate QR
              </h3>
              <p className="text-text-light dark:text-slate-400 text-sm leading-relaxed">
                We instantly generate a unique, trackable QR code. You can
                customize the design with your brand colors and logo.
              </p>
            </div>
          </div>
          {/* Step 3 */}
          <div className="flex flex-col gap-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 hover:shadow-xl hover:border-primary/50 transition-all duration-300 group">
            <div className="size-12 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-3xl">print</span>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-text-main dark:text-white text-lg font-bold">
                3. Print &amp; Stick
              </h3>
              <p className="text-text-light dark:text-slate-400 text-sm leading-relaxed">
                Download the label, print it on your packaging. Need to update
                the manual? Just upload a new file; the QR code stays the same.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowToUse;
