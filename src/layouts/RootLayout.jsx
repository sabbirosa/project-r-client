import { Outlet } from "react-router";
import Footer from "../components/shared/Footer";
import Navbar from "../components/shared/Navbar";

function RootLayout() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-all duration-200 overflow-x-hidden">
      {/* Navigation Bar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-1 w-full bg-white dark:bg-gray-900">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default RootLayout;
