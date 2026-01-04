import { useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import { useTranslation } from "react-i18next";
import SolutionsDropdown from "./SolutionsDropdown.jsx";
import ProductsDropdown from "./ProductsDropdown.jsx";
import { useState } from "react";
// import SearchBar from "../ui/SearchBar";

const Header = () => {
  const { t, i18n } = useTranslation("common");
  const [dropDown, setDropDown] = useState("");

  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  const handleChangePage = (url) => {
    navigate(url);
  };

  const handleMypage = () => {
    navigate("/mypage");
  };

  const handleLogIn = () => {
    if (window.location.pathname === "/auth") {
      window.location.reload();
    } else {
      navigate("/auth");
    }
  };

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between border-b border-solid border-slate-100 dark:border-slate-800 bg-white/90 dark:bg-background-dark/90 backdrop-blur-md px-4 py-3 lg:px-30">
      <div className="flex items-center gap-8 text-text-main dark:text-white">
        <div className="size-8 text-primary flex items-center justify-center rounded-lg bg-primary/10">
          <span className="material-symbols-outlined text-2xl">image</span>
        </div>
        <h2
          onClick={() => handleChangePage("/")}
          className="font-bold text-lg cursor-pointer text-text-main dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]"
        >
          {t("QRManual")}
        </h2>
      </div>
      <div className="hidden md:flex flex-1 justify-center gap-8">
        <a
          className="text-sm font-medium leading-normal hover:text-primary transition-colors text-text-main dark:text-slate-300"
          onClick={() => setDropDown(dropDown === "products" ? "" : "products")}
        >
          {t("products")}
        </a>
        <a
          className="text-sm font-medium leading-normal hover:text-primary transition-colors text-text-main dark:text-slate-300"
          onClick={() =>
            setDropDown(dropDown === "solutions" ? "" : "solutions")
          }
        >
          {t("solutions")}
        </a>
        <a
          className="text-sm font-medium leading-normal hover:text-primary transition-colors text-text-main dark:text-slate-300"
          onClick={() => {
            setDropDown("");
            navigate("/pricing");
          }}
        >
          {t("pricing")}
        </a>
        <a
          className="text-sm font-medium leading-normal hover:text-primary transition-colors text-text-main dark:text-slate-300"
          onClick={() => {
            setDropDown("");
            navigate("/help");
          }}
        >
          {t("help")}
        </a>
      </div>

      <div className="flex gap-3">
        {user ? (
          <>
            <button
              onClick={() => navigate("/mypage")}
              className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-9 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-text-main dark:text-white text-sm font-bold leading-normal tracking-[0.015em] transition-colors"
            >
              My Page
            </button>
            <button
              onClick={handleLogout}
              className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-9 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-text-main dark:text-white text-sm font-bold leading-normal tracking-[0.015em] transition-colors"
            >
              LOGOUT
            </button>
          </>
        ) : (
          <button
            onClick={handleLogIn}
            className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-9 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-text-main dark:text-white text-sm font-bold leading-normal tracking-[0.015em] transition-colors"
          >
            <span className="truncate">Log In</span>
          </button>
        )}
        <button className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-9 px-4 bg-primary hover:bg-primary-dark text-white text-sm font-bold leading-normal tracking-[0.015em] transition-colors shadow-lg shadow-primary/20">
          <span className="truncate">Get Started</span>
        </button>
      </div>

      <div>
        <button onClick={() => i18n.changeLanguage("ko")}>KR</button>
        <button onClick={() => i18n.changeLanguage("en")}>EN</button>
      </div>

      {dropDown && (
        <div
          className="absolute left-0 top-full w-full bg-white dark:bg-background-dark border-t border-slate-100 dark:border-slate-800 shadow-lg"
          onMouseLeave={() => setDropDown("")}
        >
          {dropDown === "products" && <ProductsDropdown />}
          {dropDown === "solutions" && <SolutionsDropdown />}
        </div>
      )}
    </header>
  );
};

export default Header;
