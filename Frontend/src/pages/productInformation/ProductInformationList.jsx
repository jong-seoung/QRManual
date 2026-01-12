import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

import MainLayout from "../../components/layout/MainLayout.jsx";
import FilterAndSearch from "../../components/productInformation/filterAndSearch.jsx";
import ProductInformationCard from "../../components/productInformation/ProductInformationCard.jsx";
import productInformationStore from "../../store/productInformationStore.js";
import Pagination from "../../components/ui/Pagination.jsx";

const ProductInformationList = () => {
  const {
    page,
    size,
    totalPages,
    totalElements,
    first,
    last,
    productInformationList,
    setPage,
    getAllProductInformation,
  } = productInformationStore();

  const navigate = useNavigate();

  useEffect(() => {
    getAllProductInformation(page, size);
  }, [getAllProductInformation]);

  return (
    <MainLayout>
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-[1200px] mx-auto flex flex-col gap-6">
            {/* <!-- Page Heading --> */}
            <div className="flex flex-wrap justify-between items-end gap-4 pb-4 border-b border-border-light dark:border-border-dark">
              <div className="flex min-w-72 flex-col gap-1">
                <p className="text-text-main dark:text-white text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em]">
                  Product documentation
                </p>
              </div>
              <button className="flex items-center justify-center gap-2 rounded-lg h-10 px-5 bg-primary hover:bg-blue-600 text-white text-sm font-bold leading-normal tracking-[0.015em] transition-colors shadow-sm">
                <span className="material-symbols-outlined text-lg">add</span>
                <span
                  onClick={() => navigate("/solutions/product-info/create")}
                  className="truncate"
                >
                  Add Product
                </span>
              </button>
            </div>
            <FilterAndSearch />
            {/* <!-- Products Table --> */}
            <div className="@container">
              <div className="flex flex-col overflow-hidden rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[800px]">
                    <thead className="bg-gray-50 dark:bg-gray-800 border-b border-border-light dark:border-border-dark">
                      <tr>
                        <th className="px-6 py-4 text-left text-text-secondary dark:text-gray-300 text-xs font-semibold uppercase tracking-wider w-[30%]">
                          Product Name
                        </th>
                        <th className="px-6 py-4 text-left text-text-secondary dark:text-gray-300 text-xs font-semibold uppercase tracking-wider w-[20%]">
                          Manufacturer
                        </th>
                        <th className="px-6 py-4 text-left text-text-secondary dark:text-gray-300 text-xs font-semibold uppercase tracking-wider w-[15%]">
                          Year
                        </th>
                        <th className="px-6 py-4 text-center text-text-secondary dark:text-gray-300 text-xs font-semibold uppercase tracking-wider w-[20%]">
                          Save User
                        </th>
                      </tr>
                    </thead>
                    <ProductInformationCard
                      productInformationList={productInformationList}
                    />
                  </table>
                </div>
                <Pagination
                  page={page}
                  size={size}
                  totalPages={totalPages}
                  totalElements={totalElements}
                  first={first}
                  last={last}
                  onChangePage={(p) => setPage(p)}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </MainLayout>
  );
};

export default ProductInformationList;
