import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import productInformationStore from "../../store/productInformationStore";
import { fileUploadService } from "../../services/fileUpload";

import MainLayout from "../../components/layout/MainLayout";
import CustomerServiceForm from "../../components/productInformation/CustomerServiceForm";
import FaqForm from "../../components/productInformation/FaqForm";
import GeneralInfoForm from "../../components/productInformation/GeneralInfoForm";
import ManualsForm from "../../components/productInformation/ManualsForm";
import PartsForm from "../../components/productInformation/PartsForm";

const ProductInformationForm = ({ mode = "create", initialData = null }) => {
  useEffect(() => {
    if (mode === "edit" && initialData) {
      setGeneralInfo(initialData.productInformation);
      setManuals(initialData.manuals);
      setFaq(initialData.faqs);
      setCustomerService(initialData.customerService);
      setParts(initialData.partsList);
    }
  }, [mode, initialData]);

  console.log(initialData);

  const { createProductInformation, updateProductInformation } =
    productInformationStore();
  const navigate = useNavigate();

  const [generalInfo, setGeneralInfo] = useState(null);
  const [manuals, setManuals] = useState([]);
  const [faq, setFaq] = useState([]);
  const [customerService, setCustomerService] = useState(null);
  const [parts, setParts] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const normalizedManuals = await normalizeManualsForRequest(manuals);
    const normalizedParts = await normalizePartsForRequest(parts);
    const normalizedGeneralInfo = await normalizeGeneralInfoForRequest(
      generalInfo
    );

    const payload = {
      productInformation: normalizedGeneralInfo,
      manuals: normalizedManuals,
      faq,
      customerService,
      parts: normalizedParts,
    };

    if (mode === "create") {
      console.log("create payload:", payload);
      await createProductInformation(payload);
      alert("Product created successfully!");
      navigate(-1);
    }

    if (mode === "edit") {
      console.log("edit payload:", payload);
      await updateProductInformation(
        initialData.productInformation.id,
        payload
      );
      alert("Product update successfully!");
      navigate(-1);
    }
  };

  const normalizeGeneralInfoForRequest = async (generalInfo) => {
    const { imageFile, user, ...rest } = generalInfo;

    let imageUrl = rest.imageUrl;

    if (imageFile) {
      if (imageUrl) {
        await fileUploadService.fileDelete(
          { path: imageUrl },
          "product-images"
        );
      }
      const response = await fileUploadService.fileUpload(
        { file: imageFile },
        "product-images"
      );
      imageUrl = response.path;
    }

    return {
      ...rest,
      imageUrl,
    };
  };

  const normalizeManualsForRequest = async (manuals) => {
    return Promise.all(
      manuals.map(async ({ pdfFile, pdfUrl, ...rest }) => {
        if (!pdfFile) return { ...rest, pdfUrl };
        if (pdfUrl) {
          await fileUploadService.fileDelete({ path: pdfUrl }, "manuals");
        }
        const response = await fileUploadService.fileUpload(
          { file: pdfFile },
          "manuals"
        );
        pdfUrl = response.path;
        const originFileName = response.originalName.split(".")[0];
        const ext = response.originalName.split(".")[1];
        return { ...rest, pdfUrl, ext, originFileName };
      })
    );
  };

  const normalizePartsForRequest = async (parts) => {
    return Promise.all(
      parts.map(async ({ imageFile, imageUrl, ...rest }) => {
        let finalImageUrl = imageUrl;

        if (!imageFile) return { ...rest, imageUrl };
        if (imageUrl) {
          await fileUploadService.fileDelete(
            { path: imageUrl },
            "parts-images"
          );
        }
        const response = await fileUploadService.fileUpload(
          { file: imageFile },
          "parts-images"
        );
        finalImageUrl = response.path;
        return { ...rest, imageUrl: finalImageUrl };
      })
    );
  };

  return (
    <MainLayout>
      <main className="flex-grow flex justify-center py-8 px-4 sm:px-6 lg:px-8">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-[1024px] flex flex-col gap-8"
        >
          {/* <!-- Breadcrumbs --> */}
          <nav className="flex text-sm text-slate-500 dark:text-slate-400">
            <ol className="flex items-center space-x-2">
              <li>
                <a
                  onClick={() => navigate("")}
                  className="hover:text-primary transition-colors"
                >
                  Home
                </a>
              </li>
              <li>
                <span className="text-slate-300 dark:text-slate-600">/</span>
              </li>
              <li>
                <a
                  onClick={() => navigate("/solutions/product-info")}
                  className="hover:text-primary transition-colors"
                >
                  Products
                </a>
              </li>
              <li>
                <span className="text-slate-300 dark:text-slate-600">/</span>
              </li>
              <li className="font-medium text-slate-900 dark:text-white">
                Create New
              </li>
            </ol>
          </nav>
          {/* <!-- Page Header --> */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex flex-col gap-1">
              <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                Create New Product
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-lg">
                Enter product details to generate a QR documentation page.
              </p>
            </div>
            <div className="flex gap-3 shrink-0">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-5 h-11 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
              >
                Cancel
              </button>
              <button className="px-5 h-11 rounded-lg bg-primary text-white font-bold text-sm hover:bg-blue-600 transition-colors shadow-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px]">
                  save
                </span>
                Save Product
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 flex flex-col gap-8">
              <GeneralInfoForm value={generalInfo} onChange={setGeneralInfo} />
              <ManualsForm value={manuals} onChange={setManuals} />
              <FaqForm value={faq} onChange={setFaq} />
            </div>
            <div className="flex flex-col gap-8">
              <CustomerServiceForm
                value={customerService}
                onChange={setCustomerService}
              />
              <PartsForm value={parts} onChange={setParts} />
            </div>
          </div>
          <div className="flex sm:hidden justify-end gap-3 pb-8">
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
              className="flex-1 h-12 rounded-lg bg-primary text-white font-bold text-sm shadow-lg shadow-primary/30"
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
