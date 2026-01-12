import { useState } from "react";
import ImageUpload from "../ui/ImageUpload";

const PartsForm = ({ value, onChange }) => {
  const parts = value ?? [
    { id: "", name: "", storeLink: "", imageUrl: null, imageFile: null },
  ];

  const addPart = () => {
    const updated = [
      ...parts,
      { id: "", name: "", storeLink: "", imageUrl: null, imageFile: null },
    ];

    onChange?.(updated);
  };

  const removePart = (index) => {
    const updated = parts.filter((_, i) => i !== index);
    onChange?.(updated);
  };

  const handleItemChange = (index, e) => {
    const { name, value } = e.target;

    const updated = parts.map((item, i) =>
      i === index ? { ...item, [name]: value } : item
    );

    onChange?.(updated);
  };

  const handleImageChange = (index, file) => {
    const updated = parts.map((item, i) =>
      i === index
        ? {
            ...item,
            imageFile: file,
          }
        : item
    );

    onChange?.(updated);
  };

  return (
    <section className="bg-white dark:bg-[#1a202c] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 flex justify-between items-center">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <span className="material-symbols-outlined text-slate-400">
            extension
          </span>
          Parts
        </h2>
        <button
          type="button"
          onClick={addPart}
          className="text-primary text-xs font-bold hover:bg-primary/5 px-2 py-1 rounded-lg transition-colors flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-[16px]">add</span>
          Add
        </button>
      </div>

      <div className="p-4 space-y-4">
        {parts.map((part, index) => (
          <div
            key={index}
            className="flex flex-row gap-1 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-700"
          >
            <ImageUpload
              value={part.imageUrl}
              onChange={(file) => handleImageChange(index, file)}
              width={80}
              height={80}
            />
            <div className="flex flex-col justify-center flex-1">
              <div className="flex justify-between items-start mb-2">
                <input
                  name="name"
                  value={part.name}
                  onChange={(e) => handleItemChange(index, e)}
                  className="w-full px-2 py-1.5 text-xs rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 placeholder-slate-400 focus:border-primary outline-none"
                  placeholder="Part name"
                />

                <button
                  type="button"
                  onClick={() => removePart(index)}
                  className="text-slate-400 hover:text-red-500 ml-2"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    close
                  </span>
                </button>
              </div>

              <input
                name="storeLink"
                value={part.storeLink}
                onChange={(e) => handleItemChange(index, e)}
                className="w-full px-2 py-1.5 text-xs rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 placeholder-slate-400 focus:border-primary outline-none"
                placeholder="Store Link URL..."
                type="text"
              />
            </div>
          </div>
        ))}

        {parts.length === 0 && (
          <div className="text-center py-4 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg">
            <p className="text-xs text-slate-400">No parts added.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default PartsForm;
