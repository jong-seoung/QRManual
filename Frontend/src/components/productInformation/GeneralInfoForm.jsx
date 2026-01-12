import { authService } from "../../services/auth";
import { useState } from "react";

import ImageUpload from "../ui/ImageUpload";

const GeneralInfoForm = ({ value, onChange }) => {
  const user = authService.getCurrentUser();
  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: currentYear - 2000 + 1 },
    (_, i) => currentYear - i
  );

  const generalInfo = value ?? {
    id: null,
    name: "",
    modelCode: "",
    releaseYear: "",
    serialNumberLocation: "",
    productPage: "",
    publicStoreLink: "",
    imageUrl: null,
    imageFile: null,
  };

  const handleChange = (e) => {
    const { name, value: inputValue } = e.target;

    onChange({
      ...generalInfo,
      [name]: name === "releaseYear" ? Number(inputValue) : inputValue,
    });
  };

  const handleImageChange = (file) => {
    onChange({
      ...generalInfo,
      imageFile: file,
    });
  };

  return (
    <section className="bg-white dark:bg-[#1a202c] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <span className="material-symbols-outlined text-slate-400">info</span>
          General Information
        </h2>
      </div>
      <div className="p-6 space-y-6">
        {/* <!-- Company Selection --> */}
        <div></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ImageUpload
            value={generalInfo.imageUrl}
            onChange={handleImageChange}
            width={250}
            height={250}
          />
          <div className="grid grid-row-1 md:grid-row-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white dark:bg-slate-800 text-slate-900 dark:text-white transition-all outline-none"
                placeholder="e.g. Smart Thermostat X1"
                name="name"
                value={generalInfo.name}
                onChange={handleChange}
                type="text"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Model Code (SKU)
              </label>
              <input
                className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white dark:bg-slate-800 text-slate-900 dark:text-white transition-all outline-none"
                placeholder="e.g. ST-X1-2024"
                name="modelCode"
                onChange={handleChange}
                value={generalInfo.modelCode}
                type="text"
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Release Year
            </label>
            <select
              className="w-full max-w-[160px] px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white dark:bg-slate-800 text-slate-900 dark:text-white transition-all outline-none appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236b7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22M6%208l4%204%204-4%22%2F%3E%3C/svg %')] bg-[length:1.5rem_1.5rem] bg-[right_0.5rem_center] bg-no-repeat pr-8"
              name="releaseYear"
              value={generalInfo.releaseYear || ""}
              onChange={handleChange}
            >
              <option value="" disabled>
                Select Year
              </option>

              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
              serialNumberLocation
            </label>
            <input
              className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white dark:bg-slate-800 text-slate-900 dark:text-white transition-all outline-none"
              placeholder="e.g. Back panel near the power"
              name="serialNumberLocation"
              onChange={handleChange}
              value={generalInfo.serialNumberLocation}
              type="text"
            />
          </div>
        </div>
        <div className="space-y-4 pt-2">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Product Detail Page Link
            </label>
            <div className="flex">
              <span className="inline-flex items-center px-3 text-sm text-slate-500 bg-slate-100 border border-r-0 border-slate-300 rounded-l-lg dark:bg-slate-700 dark:text-slate-400 dark:border-slate-600">
                https://
              </span>
              <input
                className="rounded-none rounded-r-lg bg-white border border-slate-300 text-slate-900 focus:ring-primary focus:border-primary block flex-1 min-w-0 w-full text-sm p-3 dark:bg-slate-800 dark:border-slate-600 dark:placeholder-slate-400 dark:text-white dark:focus:ring-primary dark:focus:border-primary outline-none"
                placeholder="www.acme.com/product/x1"
                name="productPage"
                onChange={handleChange}
                value={generalInfo.productPage}
                type="text"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Public Store Link
            </label>
            <div className="flex">
              <span className="inline-flex items-center px-3 text-sm text-slate-500 bg-slate-100 border border-r-0 border-slate-300 rounded-l-lg dark:bg-slate-700 dark:text-slate-400 dark:border-slate-600">
                <span className="material-symbols-outlined text-[18px]">
                  shopping_cart
                </span>
              </span>
              <input
                className="rounded-none rounded-r-lg bg-white border border-slate-300 text-slate-900 focus:ring-primary focus:border-primary block flex-1 min-w-0 w-full text-sm p-3 dark:bg-slate-800 dark:border-slate-600 dark:placeholder-slate-400 dark:text-white dark:focus:ring-primary dark:focus:border-primary outline-none"
                placeholder="store.acme.com/buy/x1"
                name="publicStoreLink"
                onChange={handleChange}
                value={generalInfo.publicStoreLink}
                type="text"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GeneralInfoForm;
