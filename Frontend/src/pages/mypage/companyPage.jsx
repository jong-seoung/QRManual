import { useState } from "react";
import useAuthStore from "../../store/authStore";

import MainLayout from "../../components/layout/MainLayout";
import CompanySidebar from "../../components/mypage/CompanySidebar";
import Dashboard from "../../components/mypage/Dashboard";
import Products from "../../components/mypage/Products";

const CompanyPage = () => {
  const [pageMode, setPageMode] = useState("Dashboard");
  const { user, logout } = useAuthStore();

  const handleSwitch = (mode) => {
    setPageMode(mode);
  };

  return (
    <MainLayout>
      <div className="flex flex-row">
        <CompanySidebar onSwitch={handleSwitch} pageMode={pageMode}/>
        <div className="flex-1">
          {pageMode === "Dashboard" && <Dashboard onSwitch={handleSwitch} />}
          {pageMode === "Products" && <Products onSwitch={handleSwitch} />}
        </div>
      </div>
    </MainLayout>
  );
};

export default CompanyPage;
