import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import useAuthStore from "./store/authStore.js";

import Home from "./pages/home.jsx";
import Auth from "./pages/auth.jsx";
import ProductInformationList from "./pages/productInformation/ProductInformationList.jsx";
import ProductInformationAdd from "./pages/productInformation/ProductInformationAdd.jsx";
import ProductInformationEdit from "./pages/productInformation/ProductInformationEdit.jsx";
import ProductInformationDetail from "./pages/productInformation/ProductInformationDetail.jsx";
import CompanyPage from "./pages/mypage/companyPage.jsx";

export default function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={isAuthenticated ? <Home /> : <Navigate to="/auth" replace />}
        />
        <Route path="/auth" element={isAuthenticated ? <Home /> : <Auth />} />
        <Route
          path="/solutions/product-info"
          element={isAuthenticated ? <ProductInformationList /> : <Auth />}
        />
        <Route
          path="/solutions/product-info/create"
          element={isAuthenticated ? <ProductInformationAdd /> : <Auth />}
        />
        <Route
          path="/solutions/product-info/edit/:id"
          element={isAuthenticated ? <ProductInformationEdit /> : <Auth />}
        />
        <Route
          path="/solutions/product-info/detail/:id"
          element={isAuthenticated ? <ProductInformationDetail /> : <Auth />}
        />
        <Route
          path="/company"
          element={isAuthenticated ? <CompanyPage /> : <Auth />}
        />
      </Routes>
    </BrowserRouter>
  );
}
