import Footer from "./Footer";
import Header from "./Header";

const MainLayout = ({ children, className = "" }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className={`flex-1 ${className}`}>
        {children}
      </main>

      <Footer />
    </div>
  );
};

export default MainLayout;