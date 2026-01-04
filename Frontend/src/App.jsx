import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import useAuthStore from "./store/authStore.js";

import Home from "./pages/home.jsx";
import Auth from "./pages/auth.jsx";
import ProductInformation from "./pages/productInformation/list.jsx";

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
        <Route path="/solutions/product-info" element={isAuthenticated ? <ProductInformation /> : <Auth />} />
      </Routes>
    </BrowserRouter>
  );
}
