import { useState } from "react";
import { useNavigate } from "react-router-dom";
import productInformationStore from "../../store/productInformationStore";

import MainLayout from "../../components/layout/MainLayout";
import CustomerServiceForm from "../../components/productInformation/CustomerServiceForm";
import FaqForm from "../../components/productInformation/FaqForm";
import GeneralInfoForm from "../../components/productInformation/GeneralInfoForm";
import ManualsFrom from "../../components/productInformation/ManualsFrom";
import PartsForm from "../../components/productInformation/PartsForm";

const ProductInformationForm = () => {
  const { createProductInformation, createProductSubAll } =
    productInformationStore();
  const navigate = useNavigate();

  const [generalInfo, setGeneralInfo] = useState(null);
  const [manuals, setManuals] = useState([]);
  const [faq, setFaq] = useState([]);
  const [customerService, setCustomerService] = useState(null);
  const [parts, setParts] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      manuals,
      faq,
      customerService,
      parts,
    };

    const product = await createProductInformation(generalInfo);
    const productInformation_id = product.id;
    await createProductSubAll(productInformation_id, payload);
    alert("Product created successfully!");
    navigate("/solutions/product-info");
  };

  return (
    <MainLayout>
      <main class="flex-grow flex justify-center py-8 px-4 sm:px-6 lg:px-8">
        <form
          onSubmit={handleSubmit}
          class="w-full max-w-[1024px] flex flex-col gap-8"
        >
          {/* <!-- Breadcrumbs --> */}
          <nav class="flex text-sm text-slate-500 dark:text-slate-400">
            <ol class="flex items-center space-x-2">
              <li>
                <a onClick={() => navigate("")} class="hover:text-primary transition-colors" >
                  Home
                </a>
              </li>
              <li>
                <span class="text-slate-300 dark:text-slate-600">/</span>
              </li>
              <li>
                <a onClick={() => navigate("/solutions/product-info")} class="hover:text-primary transition-colors">
                  Products
                </a>
              </li>
              <li>
                <span class="text-slate-300 dark:text-slate-600">/</span>
              </li>
              <li class="font-medium text-slate-900 dark:text-white">
                Create New
              </li>
            </ol>
          </nav>
          {/* <!-- Page Header --> */}
          <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div class="flex flex-col gap-1">
              <h1 class="text-3xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                Create New Product
              </h1>
              <p class="text-slate-500 dark:text-slate-400 text-lg">
                Enter product details to generate a QR documentation page.
              </p>
            </div>
            <div class="flex gap-3 shrink-0">
              <button
                type="button"
                onClick={() => navigate(-1)}
                class="px-5 h-11 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
              >
                Cancel
              </button>
              <button class="px-5 h-11 rounded-lg bg-primary text-white font-bold text-sm hover:bg-blue-600 transition-colors shadow-sm flex items-center gap-2">
                <span class="material-symbols-outlined text-[20px]">save</span>
                Save Product
              </button>
            </div>
          </div>
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div class="lg:col-span-2 flex flex-col gap-8">
              <GeneralInfoForm onChange={setGeneralInfo} />
              <ManualsFrom onChange={setManuals} />
              <FaqForm onChange={setFaq} />
            </div>
            <div class="flex flex-col gap-8">
              <CustomerServiceForm onChange={setCustomerService} />
              <PartsForm onChange={setParts} />
            </div>
          </div>
          <div class="flex sm:hidden justify-end gap-3 pb-8">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 h-12 rounded-lg border border-slate-200 bg-white text-slate-700 font-bold text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              class="flex-1 h-12 rounded-lg bg-primary text-white font-bold text-sm shadow-lg shadow-primary/30"
            >
              Save Product
            </button>
          </div>
        </form>
      </main>
    </MainLayout>
  );
};

export default ProductInformationForm;
