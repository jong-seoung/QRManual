import Header from "./Header";

const AuthLayout = ({ children, className = "" }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className={`${className}`}>{children}</main>

      <div class="flex justify-center mt-8">
        <p class="text-[#617589] dark:text-[#9aa0a6] text-sm">
          © 2024 DocuScan. All rights reserved.
          <a
            class="hover:text-[#111418] dark:hover:text-white ml-2 underline"
            href="#"
          >
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
};

export default AuthLayout;
