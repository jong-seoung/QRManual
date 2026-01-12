import { useState } from "react";

const CustomerServiceForm = ({ value, onChange }) => {
  const customerService = value ?? {
    id: null,
    phone: "",
    email: "",
    operationTime: "",
    chatLink: "",
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    onChange({
      ...customerService,
      [name]: value,
    });
  };

  return (
    <section className="bg-white dark:bg-[#1a202c] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <span className="material-symbols-outlined text-slate-400">
            support_agent
          </span>
          Customer Service
        </h2>
      </div>

      <div className="p-6 space-y-5">
        {/* Live Chat */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
            Live Chat Link
          </label>
          <div className="relative">
            <span className="absolute inset-y-2.5 left-0 pl-2 flex items-center pointer-events-none material-symbols-outlined text-slate-400 text-[18px]">
              chat
            </span>
            <input
              name="chatLink"
              value={customerService.chatLink}
              onChange={handleChange}
              className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              placeholder="https://..."
              type="text"
            />
          </div>
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
            Support Email
          </label>
          <div className="relative">
            <span className="absolute inset-y-2.5 left-0 pl-2 flex items-center pointer-events-none material-symbols-outlined text-slate-400 text-[18px]">
              mail
            </span>
            <input
              name="email"
              value={customerService.email}
              onChange={handleChange}
              className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              placeholder="support@acme.com"
              type="email"
            />
          </div>
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
            Phone Number
          </label>
          <div className="relative">
            <span className="absolute inset-y-2.5 left-0 pl-2 flex items-center pointer-events-none material-symbols-outlined text-slate-400 text-[18px]">
              call
            </span>
            <input
              name="phone"
              value={customerService.phone}
              onChange={handleChange}
              className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              placeholder="+1 (555) 000-0000"
              type="tel"
            />
          </div>
        </div>

        {/* Operation Time */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
            Operation Time
          </label>
          <div className="relative">
            <span className="absolute inset-y-2.5 left-0 pl-2 flex items-center pointer-events-none material-symbols-outlined text-slate-400 text-[18px]">
              schedule
            </span>
            <input
              name="operationTime"
              value={customerService.operationTime}
              onChange={handleChange}
              className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              placeholder="Mon-Fri, 9am - 6pm EST"
              type="text"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CustomerServiceForm;
