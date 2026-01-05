import { useParams } from "react-router-dom";
import { useEffect } from "react";

import MainLayout from "../../components/layout/MainLayout";
import productInformationStore from "../../store/productInformationStore";

const ProductInformationDetail = () => {
  const { getProductInformationById, ProductInformationById } =
    productInformationStore();

  const { id } = useParams();

  useEffect(() => {
    if (id) {
      getProductInformationById(id);
    }
  }, [id, getProductInformationById]);

  const productInformation = ProductInformationById?.productInformation;
  const manuals = ProductInformationById?.manuals ?? [];
  const faqs = ProductInformationById?.faqs ?? [];
  const parts = ProductInformationById?.partsList ?? [];
  const customerService = ProductInformationById?.customerService;

  console.log(ProductInformationById);

  if (!productInformation) {
    return (
      <MainLayout>
        <div className="text-center py-20">로딩중...</div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <main class="flex-grow w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {/* <!-- 1. Hero Section: Product Overview --> */}
        <section class="bg-white dark:bg-[#1a2634] rounded-2xl shadow-sm border border-[#e5e7eb] dark:border-gray-700 overflow-hidden">
          <div class="flex flex-col md:flex-row">
            {/* <!-- Product Image --> */}
            <div class="w-full md:w-2/5 h-64 md:h-auto bg-[#f8fafc] dark:bg-[#131d27] flex items-center justify-center p-8 relative">
              <div class="absolute top-4 left-4 bg-white dark:bg-black/30 px-2 py-1 rounded text-xs font-bold uppercase tracking-wider text-[#617589]">
                Model AP-2024
              </div>
              <div
                class="w-full h-full bg-contain bg-center bg-no-repeat"
                data-alt="White modern air purifier device"
                // style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuD8Mj9e-nlUUkAehBE7s1M83v32P5LQeIZsdeAEFPVfdZzZWIxbH50UFqcO_Pf5vg6nO7DJXsz9qsAgC7J0NzBp-UsgGiZI3WkE4AgoAKt4nw4wqo4YZbLh9tjdYIz2PFzky6E7B6J-MqyZMCCmlxPef_6P7Ft2pYZHQdRq5DdXP9CILq2cMaEST927On9qk2Cf3yCjysj5YlAr-062LV9A3QnXLrS8ENESxKYG3ugoX52W9ZdpMGHH2F4GwfXcjHC-w1qvW5TBqLA');"
              ></div>
            </div>
            {/* <!-- Product Details --> */}
            <div class="w-full md:w-3/5 p-6 md:p-10 flex flex-col justify-center">
              <div class="mb-4">
                <h1 class="text-3xl font-bold text-[#111418] dark:text-white mb-2 tracking-tight">
                  {productInformation.name}
                </h1>
                <p class="text-[#617589] dark:text-gray-400 text-sm font-medium">
                  Release Year: {productInformation.releaseYear} | Model:{" "}
                  {productInformation.modelCode}
                </p>
                <p class="text-[#617589] dark:text-gray-400 text-sm font-medium">
                  serialNumberLocation:{" "}
                  {productInformation.serialNumberLocation}
                </p>
              </div>
              <p class="text-[#617589] dark:text-gray-300 text-base leading-relaxed mb-8">
                Experience cleaner air with our high-efficiency particulate air
                filtration system. Designed for large living spaces up to 500
                sq. ft., featuring whisper-quiet operation mode and smart app
                connectivity for real-time monitoring. 설명 예시입니다.
              </p>
              <div class="flex flex-wrap gap-4">
                <a
                  class="flex-1 sm:flex-none min-w-[160px] inline-flex items-center justify-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-primary hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  href={productInformation.productPage}
                >
                  Visit Online Store
                  <span class="material-symbols-outlined text-lg ml-2">
                    shopping_bag
                  </span>
                </a>
                <a
                  class="flex-1 sm:flex-none min-w-[160px] inline-flex items-center justify-center px-6 py-3 border border-[#dbe0e6] dark:border-gray-600 text-sm font-medium rounded-lg text-[#111418] dark:text-white bg-white dark:bg-[#1a2634] hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  href={productInformation.publicStoreLink}
                >
                  Official Page
                  <span class="material-symbols-outlined text-lg ml-2">
                    open_in_new
                  </span>
                </a>
              </div>
            </div>
          </div>
        </section>
        {/* <!-- 2. Customer Support Section --> */}
        <section>
          <div class="flex items-center gap-3 mb-6">
            <div class="bg-primary/10 p-2 rounded-full">
              <span class="material-symbols-outlined text-primary">
                support_agent
              </span>
            </div>
            <h2 class="text-2xl font-bold text-[#111418] dark:text-white">
              Customer Support
            </h2>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* <!-- Phone --> */}
            <div class="group bg-white dark:bg-[#1a2634] p-6 rounded-xl border border-[#dbe0e6] dark:border-gray-700 hover:border-primary/50 transition-colors cursor-pointer">
              <div class="w-12 h-12 rounded-full bg-[#f0f9ff] dark:bg-blue-900/20 flex items-center justify-center mb-4 text-primary group-hover:scale-110 transition-transform">
                <span class="material-symbols-outlined text-[28px]">call</span>
              </div>
              <h3 class="font-bold text-lg mb-1">Phone Support</h3>
              <p class="text-primary font-semibold text-lg mb-1">
                {customerService?.phone}
              </p>
              <p class="text-[#617589] dark:text-gray-400 text-sm">
                {customerService?.operationTime}
              </p>
            </div>
            {/* <!-- Email --> */}
            <div class="group bg-white dark:bg-[#1a2634] p-6 rounded-xl border border-[#dbe0e6] dark:border-gray-700 hover:border-primary/50 transition-colors cursor-pointer">
              <div class="w-12 h-12 rounded-full bg-[#f0f9ff] dark:bg-blue-900/20 flex items-center justify-center mb-4 text-primary group-hover:scale-110 transition-transform">
                <span class="material-symbols-outlined text-[28px]">mail</span>
              </div>
              <h3 class="font-bold text-lg mb-1">Email Support</h3>
              <p class="text-primary font-semibold text-lg mb-1 break-all">
                {customerService?.email}
              </p>
              <p class="text-[#617589] dark:text-gray-400 text-sm">
                Response within 24 hours
              </p>
            </div>
            {/* <!-- Chat --> */}
            <div
              href={customerService?.chatLink}
              class="group bg-white dark:bg-[#1a2634] p-6 rounded-xl border border-[#dbe0e6] dark:border-gray-700 hover:border-primary/50 transition-colors cursor-pointer"
            >
              <div class="w-12 h-12 rounded-full bg-[#f0f9ff] dark:bg-blue-900/20 flex items-center justify-center mb-4 text-primary group-hover:scale-110 transition-transform">
                <span class="material-symbols-outlined text-[28px]">forum</span>
              </div>
              <h3 class="font-bold text-lg mb-1">Live Chat</h3>
              <p class="text-primary font-semibold text-lg mb-1">
                Go Chating room
              </p>
              <p class="text-[#617589] dark:text-gray-400 text-sm">
                Chat with Agent
              </p>
            </div>
          </div>
        </section>
        {/* <!-- 3. Manuals & Downloads --> */}
        <section>
          <div class="flex items-center gap-3 mb-6">
            <div class="bg-primary/10 p-2 rounded-full">
              <span class="material-symbols-outlined text-primary">
                description
              </span>
            </div>
            <h2 class="text-2xl font-bold text-[#111418] dark:text-white">
              Manuals &amp; Downloads
            </h2>
          </div>
          <div class="bg-white dark:bg-[#1a2634] rounded-xl border border-[#dbe0e6] dark:border-gray-700 divide-y divide-[#f0f2f4] dark:divide-gray-700 overflow-hidden">
            {/* <!-- Manual Item 1 --> */}
            <div className="bg-white dark:bg-[#1a2634] rounded-xl border border-[#dbe0e6] dark:border-gray-700 divide-y divide-[#f0f2f4] dark:divide-gray-700 overflow-hidden">
              {manuals.length === 0 && (
                <div className="p-5 text-center text-gray-500">
                  등록된 매뉴얼이 없습니다.
                </div>
              )}

              {manuals.map((manual) => (
                <div
                  key={manual.id}
                  className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="bg-red-50 text-red-500 rounded p-2 mt-1">
                      <span className="material-symbols-outlined">
                        picture_as_pdf
                      </span>
                    </div>

                    <div>
                      <h4 className="font-bold text-[#111418] dark:text-white text-base">
                        {manual.language?.toUpperCase()} Manual
                      </h4>
                      <p className="text-[#617589] dark:text-gray-400 text-sm mt-1">
                        {manual.language?.toUpperCase()} • PDF
                      </p>
                    </div>
                  </div>

                  <a
                    href={manual.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-[#f0f2f4] dark:bg-gray-700 text-[#111418] dark:text-white rounded-lg font-medium text-sm hover:bg-[#dce2e8] dark:hover:bg-gray-600 transition-colors"
                  >
                    <span className="material-symbols-outlined text-lg">
                      download
                    </span>
                    Download
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>
        {/* <!-- 4. Parts & Accessories --> */}
        <section>
          <div class="flex items-center gap-3 mb-6">
            <div class="bg-primary/10 p-2 rounded-full">
              <span class="material-symbols-outlined text-primary">build</span>
            </div>
            <h2 class="text-2xl font-bold text-[#111418] dark:text-white">
              Parts &amp; Accessories
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {parts.length === 0 && (
              <div className="col-span-full text-center text-gray-500 py-6">
                등록된 부품이 없습니다.
              </div>
            )}

            {parts.map((part) => (
              <div
                key={part.id}
                className="bg-white dark:bg-[#1a2634] rounded-xl border border-[#dbe0e6] dark:border-gray-700 p-4 flex flex-col items-center text-center group"
              >
                <div className="w-full aspect-square rounded-lg bg-[#f6f7f8] dark:bg-black/20 mb-4 overflow-hidden relative">
                  <div
                    className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-300"
                    style={{
                      backgroundImage: part.imageUrl
                        ? `url(${part.imageUrl})`
                        : undefined,
                    }}
                    aria-label={part.name}
                  />
                </div>

                <h3 className="font-bold text-sm text-[#111418] dark:text-white line-clamp-2 mb-1">
                  {part.name}
                </h3>

                {part.partCode && (
                  <p className="text-xs text-[#617589] mb-3">
                    Part #{part.partCode}
                  </p>
                )}

                {part.storeLink && (
                  <a
                    href={part.storeLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto text-primary text-sm font-bold flex items-center hover:underline"
                  >
                    Buy Now
                    <span className="material-symbols-outlined text-base ml-1">
                      arrow_forward
                    </span>
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>
        {/* <!-- 5. FAQ Section --> */}
        <section>
          <div class="flex items-center gap-3 mb-6">
            <div class="bg-primary/10 p-2 rounded-full">
              <span class="material-symbols-outlined text-primary">help</span>
            </div>
            <h2 class="text-2xl font-bold text-[#111418] dark:text-white">
              Frequently Asked Questions
            </h2>
          </div>
          <div class="space-y-3">
            <div className="space-y-4">
              {faqs.length === 0 && (
                <div className="text-center text-gray-500 py-6">
                  등록된 FAQ가 없습니다.
                </div>
              )}

              {faqs.map((faq) => (
                <details
                  key={faq.id}
                  className="group bg-white dark:bg-[#1a2634] rounded-xl border border-[#dbe0e6] dark:border-gray-700 overflow-hidden open:ring-1 open:ring-primary/20"
                >
                  <summary className="flex items-center justify-between p-5 cursor-pointer list-none font-bold text-[#111418] dark:text-white text-base">
                    <span>{faq.question}</span>
                    <span className="material-symbols-outlined transition-transform duration-200 group-open:rotate-180 text-[#617589]">
                      expand_more
                    </span>
                  </summary>

                  <div className="px-5 pb-5 text-[#617589] dark:text-gray-400 text-sm leading-relaxed border-t border-transparent group-open:border-[#f0f2f4] dark:group-open:border-gray-700 pt-4">
                    {faq.answer}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>
    </MainLayout>
  );
};

export default ProductInformationDetail;
