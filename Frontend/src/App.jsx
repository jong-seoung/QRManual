import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import useAuthStore from "./store/authStore.js";

import Home from "./pages/home.jsx";
import Auth from "./pages/auth.jsx";
import ProductInformationList from "./pages/productInformation/list.jsx";
import ProductInformationForm from "./pages/productInformation/add.jsx";
import ProductInformationDetail from "./pages/productInformation/detail.jsx";
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
          element={isAuthenticated ? <ProductInformationForm /> : <Auth />}
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
