
import React, { useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";

const DashboardLayout: React.FC = () => {
  const { isLoggedIn, isAdmin } = useAuth();
  const { language, setLanguage } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  // Check for authentication and redirect accordingly
  useEffect(() => {
    // Check if user is logged in
    if (!isLoggedIn) {
      navigate("/login");
    }
    
    // Redirect to appropriate dashboard based on user role and current location
    if (location.pathname === "/dashboard" && !isAdmin) {
      navigate("/dashboard/orders");
    }
  }, [isLoggedIn, navigate, isAdmin, location.pathname]);

  // Apply language settings on mount and route changes
  useEffect(() => {
    // Get language from localStorage on every navigation
    const savedLanguage = localStorage.getItem("appLanguage");
    if (savedLanguage && ["en", "ar", "fr"].includes(savedLanguage) && savedLanguage !== language) {
      console.log("Applying saved language from localStorage:", savedLanguage);
      setLanguage(savedLanguage as "en" | "ar" | "fr");
    }

    // Set the language attribute on the html element
    document.documentElement.lang = language;
    
    // Set the direction attribute based on the language
    if (language === "ar") {
      document.documentElement.dir = "rtl";
    } else {
      document.documentElement.dir = "ltr";
    }

    console.log("Language applied on route change:", language, "Path:", location.pathname);
  }, [language, setLanguage, location.pathname]);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Navbar onMenuClick={() => {}} />
        <main className="p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
