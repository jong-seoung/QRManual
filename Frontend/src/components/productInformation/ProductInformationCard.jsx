import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { productInformationService } from "../../services/productInformation";

const ProductInformationCard = ({
  productInformationList,
  mode = "basic",
  ChangeEditPage,
  onDelete,
}) => {
  const navigate = useNavigate();

  const [savedMap, setSavedMap] = useState({});
  const [countMap, setCountMap] = useState({});

  const onToggleSave = async (e, item) => {
    e.stopPropagation();

    try {
      const currentSaved = savedMap[item.id] ?? item.saved ?? false;

      const currentCount = countMap[item.id] ?? item.saveCount ?? 0;

      const nextSaved = await productInformationService.toggleBookmark(
        item.id,
        currentSaved
      );

      setSavedMap((prev) => ({
        ...prev,
        [item.id]: nextSaved,
      }));

      setCountMap((prev) => ({
        ...prev,
        [item.id]: nextSaved ? currentCount + 1 : Math.max(currentCount - 1, 0),
      }));
    } catch {
      alert("북마크 처리 중 오류가 발생했습니다.");
    }
  };

  return (
    <tbody className="divide-y divide-border-light dark:divide-border-dark">
      {productInformationList.map((item) => {
        const saved = savedMap[item.id] ?? item.saved ?? false;
        const count = countMap[item.id] ?? item.saveCount ?? 0;

        return (
          <tr
            key={item.id}
            onClick={() =>
              navigate("/solutions/product-info/detail/" + item.id)
            }
            className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
          >
            {/* 제품 정보 */}
            <td className="px-6 py-4">
              <div className="flex gap-3 items-center">
                <div
                  className="w-16 h-16 bg-contain bg-center bg-no-repeat rounded border border-background-light"
                  style={{
                    backgroundImage: item.imageUrl
                      ? `url(${item.imageUrl})`
                      : undefined,
                  }}
                />
                <div>
                  <p className="text-sm font-bold">{item.name}</p>
                  <p className="text-xs text-gray-400">{item.modelCode}</p>
                </div>
              </div>
            </td>

            {/* 회사 */}
            <td className="px-6 py-4">
              {item.user?.companyInfo?.name ?? "Unknown"}
            </td>

            {/* 출시 연도 */}
            <td className="px-6 py-4 text-left">{item.releaseYear ?? "-"}</td>

            {/* 저장 */}
            <td className="px-6 py-4">
              <div className="flex flex-col items-center gap-1">
                <span className="text-sm font-semibold">{count}</span>

                {mode == "basic" && (
                  <button
                    onClick={(e) => onToggleSave(e, item)}
                    title={saved ? "Unsave" : "Save"}
                    className={`p-2 rounded-lg transition-all
                    ${
                      saved
                        ? "text-primary bg-blue-50 dark:bg-blue-900/20"
                        : "text-gray-400 hover:text-primary hover:bg-blue-50 dark:hover:bg-blue-900/20"
                    }
                  `}
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {saved ? "bookmark" : "bookmark_border"}
                    </span>
                  </button>
                )}
              </div>
            </td>

            {mode == "company" && (
              <td className="px-6 py-4">
                <div className="flex flex-col items-center gap-1">
                  <button onClick={(e) => ChangeEditPage(e, item.id)}>
                    <span className="text-[12px]">수정</span>
                  </button>

                  <button onClick={(e) => onDelete(e, item.id)}>
                    <span className="text-[12px]">삭제</span>
                  </button>
                </div>
              </td>
            )}
          </tr>
        );
      })}
    </tbody>
  );
};

export default ProductInformationCard;
