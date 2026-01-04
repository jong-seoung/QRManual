const ProductInformationCard = ({ productInformationList }) => {

  console.log(productInformationList);
    return (
    <tbody className="divide-y divide-border-light dark:divide-border-dark">
      {productInformationList.map((item) => (
        <tr
          key={item.id}
          className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group"
        >
          {/* 제품 정보 */}
          <td className="px-6 py-4">
            <div className="flex items-center gap-4">
              <div className="flex flex-col">
                <p className="text-text-main dark:text-white text-sm font-bold">
                  {item.name}
                </p>
                <p className="text-text-secondary dark:text-gray-400 text-xs font-mono mt-0.5">
                  {item.modelCode}
                </p>
              </div>
            </div>
          </td>

          {/* 회사 정보 */}
          <td className="px-6 py-4">
            <div className="flex items-center gap-2">
              <div className="size-6 rounded-full bg-white flex items-center justify-center border border-gray-200 p-0.5">
                <span className="material-symbols-outlined text-sm text-gray-600">
                  business
                </span>
              </div>
              <span className="text-text-main dark:text-white text-sm">
                {item.user?.companyInfo?.name ?? "Unknown"}
              </span>
            </div>
          </td>

          {/* 출시 연도 */}
          <td className="px-6 py-4">
            <span className="text-text-secondary dark:text-gray-400 text-sm">
              {item.releaseYear ?? "-"}
            </span>
          </td>

          {/* 액션 */}
          <td className="px-6 py-4 text-right">
            <div className="flex items-center justify-end gap-2">
              <button
                className="p-2 rounded-lg text-gray-400 hover:text-primary hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all tooltip"
                title="Save User"
              >
                123154
              </button>
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  );
};

export default ProductInformationCard;
