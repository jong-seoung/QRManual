import { useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import { useTranslation } from "react-i18next";
// import SearchBar from "../ui/SearchBar";

const Header = () => {
  const { t, i18n } = useTranslation("common");
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
    <>
      <div className="w-full h-9 bg-black fixed top-0 z-50"></div>
      <header className="fixed top-9 w-full z-40 bg-white h-17 flex items-center justify-between px-80">
        {/* 좌측: 로고 */}
        <div className="flex gap-4">
          <div
            onClick={() => handleChangePage("/")}
            className="font-bold text-lg cursor-pointer"
          >
            {t("QRManual")}
          </div>

          {/* 중앙: 메뉴 */}
          <nav className="flex gap-15 ml-70">
            <div
              onClick={() => handleChangePage("/Product?gender=null")}
              className="cursor-pointer"
            >
              {t("products")}
            </div>
            <div
              onClick={() => handleChangePage("/Product?gender=MAN")}
              className="cursor-pointer"
            >
              {t("solutions")}
            </div>
            <div
              onClick={() => handleChangePage("/Product?gender=WOMAN")}
              className="cursor-pointer"
            >
              {t("pricing")}
            </div>
            <div
              onClick={() => handleChangePage("/Product?gender=KIDS")}
              className="cursor-pointer"
            >
              {t("help")}
            </div>
          </nav>
        </div>

        {/* 우측: 아이콘 / 로그인 */}
        <div className="flex gap-4 items-center">
          {/* <div className="mr-20">
            <SearchBar />
          </div> */}
          {user ? (
            <>
              <div
                onClick={() => navigate("/mypage")}
                className="cursor-pointer"
              >
                My Page
              </div>
              <div onClick={handleLogout} className="cursor-pointer">
                LOGOUT
              </div>
            </>
          ) : (
            <div onClick={handleLogIn} className="cursor-pointer">
              Login
            </div>
          )}
        </div>

        <div>
          <button onClick={() => i18n.changeLanguage("ko")}>KR</button>
          <button onClick={() => i18n.changeLanguage("en")}>EN</button>
        </div>

        {/* 헤더 밑 구분선 */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-300"></div>
      </header>
    </>
  );
};

export default Header;
