import { useNavigate } from "react-router-dom";

const ProductsDropdown = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-3 gap-6">
      <div
        onClick={() => navigate("/products/qr")}
        className="cursor-pointer p-4 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
      >
        <h3 className="font-bold mb-1">QR Manual</h3>
        <p className="text-sm text-slate-500">
          QR 기반 제품 설명서 관리
        </p>
      </div>

      <div
        onClick={() => navigate("/products/admin")}
        className="cursor-pointer p-4 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
      >
        <h3 className="font-bold mb-1">Admin Console</h3>
        <p className="text-sm text-slate-500">
          제품 & 매뉴얼 관리 대시보드
        </p>
      </div>
    </div>
  );
};

export default ProductsDropdown;
