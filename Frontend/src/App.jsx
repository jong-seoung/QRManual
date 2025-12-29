import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import useAuthStore from "./store/authStore.js";

import Home from "./pages/home.jsx";
import Auth from "./pages/auth.jsx";

export default function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          // element={isAuthenticated ? <Home /> : <Navigate to="/auth" replace />}
          element={<Home />}
        />

        <Route path="/auth" element={isAuthenticated ? <Home /> : <Auth />} />
      </Routes>
    </BrowserRouter>
  );
}
