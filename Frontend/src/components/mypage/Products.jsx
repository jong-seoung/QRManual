import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import FilterAndSearch from "../../components/productInformation/filterAndSearch.jsx";
import ProductInformationCard from "../../components/productInformation/ProductInformationCard.jsx";
import useAuthStore from "../../store/authStore";
import productInformationStore from "../../store/productInformationStore";
import Pagination from "../ui/Pagination.jsx";

import { productInformationService } from "../../services/productInformation";

const Products = ({ onSwitch }) => {
  const navigate = useNavigate();

  const { user } = useAuthStore();

  const {
    page,
    size,
    totalPages,
    totalElements,
    first,
    last,
    productInformationList,
    setPage,
    getAllProductInformationByCompanyId,
  } = productInformationStore();

  useEffect(() => {
    if (!user?.companyInfo?.id) return;

    const fetchProductInformation = async () => {
      try {
        await getAllProductInformationByCompanyId(
          page,
          size,
          user.companyInfo.id
        );
      } catch (error) {
        console.error("상품 정보 조회 실패:", error);
      }
    };

    fetchProductInformation();
  }, [page, size, user?.companyInfo?.id]);

  const ChangeEditPage = (e, id) => {
    e.stopPropagation();
    navigate(`/solutions/product-info/edit/${id}`);
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!confirm("삭제하시겠습니까?")) return;
    await productInformationService.deleteProductInformation(id);

    await getAllProductInformationByCompanyId(page, size, user.companyInfo.id);
  };

  return (
    <main className="flex-1 flex flex-col h-full overflow-hidden relative">
      <div className="flex overflow-y-auto p-4 md:p-8">
        <div className="w-full mx-auto flex flex-col gap-6">
          {/* Page Heading */}
          <div className="flex flex-wrap justify-between items-end gap-4 pb-4 border-b border-border-light dark:border-border-dark">
            <div className="flex min-w-72 flex-col gap-1">
              <p className="text-text-main dark:text-white text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em]">
                Company DOCS
              </p>
            </div>

            <button
              onClick={() => navigate("/solutions/product-info/create")}
              className="flex items-center justify-center gap-2 rounded-lg h-10 px-5 bg-primary hover:bg-blue-600 text-white text-sm font-bold leading-normal tracking-[0.015em] transition-colors shadow-sm"
            >
              <span className="material-symbols-outlined text-lg">add</span>
              <span>Add Product</span>
            </button>
          </div>

          {/* Filter & Search */}
          <FilterAndSearch />

          {/* Products Table */}
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
                      <th className="px-6 py-4 text-center text-text-secondary dark:text-gray-300 text-xs font-semibold uppercase tracking-wider w-[15%]">
                        Save User
                      </th>
                      <th className="px-6 py-4 text-center text-text-secondary dark:text-gray-300 text-xs font-semibold uppercase tracking-wider w-[20%]">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <ProductInformationCard
                    productInformationList={productInformationList}
                    mode="company"
                    ChangeEditPage={ChangeEditPage}
                    onDelete={handleDelete}
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
  );
};

export default Products;
