const CompanySidebar = ({ onSwitch, pageMode }) => {
  const isActive = (page) =>
    pageMode === page
      ? "bg-primary/10 text-primary dark:text-primary"
      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800";

  return (
    <aside className="hidden lg:flex flex-col w-64 h-full bg-surface-light dark:bg-surface-dark border-r border-border-light dark:border-border-dark flex-shrink-0 transition-colors duration-200">
      {/* User Info */}
      <div className="p-4 border-t border-border-light dark:border-border-dark">
        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors">
          <div className="size-8 rounded-full bg-slate-200 dark:bg-slate-700" />
          <div className="flex flex-col overflow-hidden">
            <p className="text-sm font-medium truncate">Admin User</p>
            <p className="text-xs text-slate-500 truncate">admin@techstart.com</p>
          </div>
        </div>
      </div>

      <div className="my-4 border-t border-border-light dark:border-border-dark" />

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-1 px-4 overflow-y-auto no-scrollbar">
        {/* Dashboard */}
        <button
          onClick={() => onSwitch("Dashboard")}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive(
            "Dashboard"
          )}`}
        >
          <span className="material-symbols-outlined">dashboard</span>
          <span className="text-sm font-medium">Dashboard</span>
        </button>

        {/* Products */}
        <button
          onClick={() => onSwitch("Products")}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive(
            "Products"
          )}`}
        >
          <span className="material-symbols-outlined">inventory_2</span>
          <span className="text-sm font-medium">Products</span>
        </button>

        {/* Analytics */}
        <button
          onClick={() => onSwitch("Analytics")}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive(
            "Analytics"
          )}`}
        >
          <span className="material-symbols-outlined">analytics</span>
          <span className="text-sm font-medium">Analytics</span>
        </button>

        {/* Company Profile */}
        <button
          onClick={() => onSwitch("CompanyProfile")}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive(
            "CompanyProfile"
          )}`}
        >
          <span className="material-symbols-outlined">domain</span>
          <span className="text-sm font-medium">Company Profile</span>
        </button>

        {/* Support */}
        <button
          onClick={() => onSwitch("Support")}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive(
            "Support"
          )}`}
        >
          <span className="material-symbols-outlined">support_agent</span>
          <span className="text-sm font-medium">Support</span>
        </button>

        <div className="my-4 border-t border-border-light dark:border-border-dark" />

        <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
          Settings
        </p>

        {/* Account Settings */}
        <button
          onClick={() => onSwitch("AccountSettings")}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive(
            "AccountSettings"
          )}`}
        >
          <span className="material-symbols-outlined">settings</span>
          <span className="text-sm font-medium">Account Settings</span>
        </button>
      </nav>
    </aside>
  );
};

export default CompanySidebar;
