import { useNavigate } from "react-router-dom";

const SolutionsDropdown = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto px-6 py-1 grid grid-cols-3 gap-6">
      <div className="p-4 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800">
        <h3 className="font-bold mb-1">산업</h3>
        <div
          onClick={() => navigate("/solutions/product-info")}
          className="cursor-pointer flex flex-row"
        >
          <span>제품 설명서 QR</span>
        </div>
        <div
          onClick={() => navigate("/solutions/product-info")}
          className="cursor-pointer flex flex-row"
        >
          <span>택배 송장 QR</span>
        </div>
      </div>

      <div className="cursor-pointer p-4 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800">
        <h3 className="font-bold mb-1">산업</h3>
        <div
          onClick={() => navigate("/solutions/product-info")}
          className="cursor-pointer flex flex-row"
        >
          <span>제품 설명서 QR</span>
        </div>
        <div
          onClick={() => navigate("/solutions/product-info")}
          className="cursor-pointer flex flex-row"
        >
          <span>택배 송장 QR</span>
        </div>
      </div>

      <div className="cursor-pointer p-4 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800">
        <h3 className="font-bold mb-1">산업</h3>
        <div
          onClick={() => navigate("/solutions/product-info")}
          className="cursor-pointer flex flex-row"
        >
          <span>제품 설명서 QR</span>
        </div>
        <div
          onClick={() => navigate("/solutions/product-info")}
          className="cursor-pointer flex flex-row"
        >
          <span>택배 송장 QR</span>
        </div>
      </div>
    </div>
  );
};

export default SolutionsDropdown;
