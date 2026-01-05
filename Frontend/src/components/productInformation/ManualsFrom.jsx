import { useState } from "react";
import { LANGUAGES } from "../../i18n/languages";

const ManualsFrom = ({ onChange }) => {
  const [manuals, setManuals] = useState([{ language: "", pdfUrl: "" }]);

  const addManual = () => {
    setManuals((prev) => {
      const updated = [...prev, { language: "", pdfUrl: "" }];
      onChange?.(updated);
      return updated;
    });
  };

  const removeManual = (index) => {
    setManuals((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      onChange?.(updated);
      return updated;
    });
  };

  const handleItemChange = (index, e) => {
    const { name, value } = e.target;

    setManuals((prev) => {
      const updated = prev.map((item, i) =>
        i === index ? { ...item, [name]: value } : item
      );

      onChange?.(updated);
      return updated;
    });
  };

  return (
    <section class="bg-white dark:bg-[#1a202c] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
      <div class="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
        <h2 class="text-lg font-bold flex items-center gap-2">
          <span class="material-symbols-outlined text-slate-400">
            menu_book
          </span>
          Manuals &amp; Documents
        </h2>
        <button
          onClick={addManual}
          class="text-primary text-sm font-bold hover:bg-primary/5 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
        >
          <span class="material-symbols-outlined text-[18px]">add_circle</span>
          Add Manual
        </button>
      </div>
      <div class="p-6 space-y-4">
        {manuals.map((manual, index) => (
          <div
            key={index}
            class="flex flex-col sm:flex-row gap-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 group"
          >
            <div class="w-full sm:w-1/3">
              <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
                Language
              </label>
              <select
                name="language"
                value={manual.language}
                onChange={(e) => handleItemChange(index, e)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm focus:border-primary outline-none"
              >
                <option value="">Select</option>
                {LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.label}
                  </option>
                ))}
              </select>
            </div>

            <div class="flex-1">
              <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
                PDF URL
              </label>
              <input
                name="pdfUrl"
                value={manual.pdfUrl}
                onChange={(e) => handleItemChange(index, e)}
                class="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm focus:border-primary outline-none"
                placeholder="https://..."
                type="text"
              />
            </div>

            <div class="flex items-end pb-1">
              <button
                type="button"
                onClick={() => removeManual(index)}
                class="text-slate-400 hover:text-red-500 transition-colors p-1"
              >
                <span class="material-symbols-outlined">delete</span>
              </button>
            </div>
          </div>
        ))}
        {manuals.length === 0 && (
          <div className="text-center py-4 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg">
            <p className="text-xs text-slate-400">No manuals added.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ManualsFrom;
