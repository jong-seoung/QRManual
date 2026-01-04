const Footer = () => {
  return (
    <footer className="bg-slate-50 dark:bg-[#0b1219] pt-16 pb-8 border-t border-slate-200 dark:border-slate-800">
      <div className="px-4 lg:px-40 max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 text-text-main dark:text-white">
              <div className="size-6 text-primary">
                <span className="material-symbols-outlined">qr_code_scanner</span>
              </div>
              <h2 className="text-lg font-bold">DocuQR</h2>
            </div>
            <p className="text-sm text-text-light dark:text-slate-500">
              Modernizing product documentation for the digital age.
            </p>
          </div>
          {/* Links 1 */}
          <div className="flex flex-col gap-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-text-main dark:text-white">
              Product
            </h4>
            <a
              className="text-sm text-text-light dark:text-slate-400 hover:text-primary transition-colors"
              href="#"
            >
              Features
            </a>
            <a
              className="text-sm text-text-light dark:text-slate-400 hover:text-primary transition-colors"
              href="#"
            >
              Integrations
            </a>
            <a
              className="text-sm text-text-light dark:text-slate-400 hover:text-primary transition-colors"
              href="#"
            >
              Enterprise
            </a>
            <a
              className="text-sm text-text-light dark:text-slate-400 hover:text-primary transition-colors"
              href="#"
            >
              Success Stories
            </a>
          </div>
          {/* Links 2 */}
          <div className="flex flex-col gap-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-text-main dark:text-white">
              Company
            </h4>
            <a
              className="text-sm text-text-light dark:text-slate-400 hover:text-primary transition-colors"
              href="#"
            >
              About Us
            </a>
            <a
              className="text-sm text-text-light dark:text-slate-400 hover:text-primary transition-colors"
              href="#"
            >
              Careers
            </a>
            <a
              className="text-sm text-text-light dark:text-slate-400 hover:text-primary transition-colors"
              href="#"
            >
              Blog
            </a>
            <a
              className="text-sm text-text-light dark:text-slate-400 hover:text-primary transition-colors"
              href="#"
            >
              Contact
            </a>
          </div>
          {/* Newsletter */}
          <div className="flex flex-col gap-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-text-main dark:text-white">
              Stay Updated
            </h4>
            <div className="flex gap-2">
              <input
                className="flex-1 h-10 px-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:border-primary text-text-main dark:text-white"
                placeholder="Enter your email"
                type="email"
              />
              <button className="h-10 px-4 rounded-lg bg-primary hover:bg-primary-dark text-white text-sm font-bold transition-colors">
                <span className="material-symbols-outlined text-sm">
                  arrow_forward
                </span>
              </button>
            </div>
          </div>
        </div>
        <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-text-light dark:text-slate-500">
            © 2023 DocuQR Inc. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a
              className="text-text-light dark:text-slate-500 hover:text-primary transition-colors"
              href="#"
            >
              <span className="material-symbols-outlined">public</span>
            </a>{" "}
            {/* Web */}
            <a
              className="text-text-light dark:text-slate-500 hover:text-primary transition-colors"
              href="#"
            >
              <span className="material-symbols-outlined">share</span>
            </a>{" "}
            {/* Share/Social */}
            <a
              className="text-text-light dark:text-slate-500 hover:text-primary transition-colors"
              href="#"
            >
              <span className="material-symbols-outlined">mail</span>
            </a>{" "}
            {/* Mail */}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
