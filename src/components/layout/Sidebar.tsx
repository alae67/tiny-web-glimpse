
import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  TrendingUp,
  Scan,
  Users
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label, isActive, onClick }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 transition-all",
          isActive
            ? "bg-store-DEFAULT text-white"
            : "text-gray-500 hover:text-store-DEFAULT hover:bg-gray-100"
        )
      }
      onClick={onClick}
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  );
};

interface SidebarProps {
  isMobile?: boolean;
  onCloseMobile?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isMobile = false, onCloseMobile }) => {
  const location = useLocation();
  const { isAdmin } = useAuth();
  const { t, language } = useLanguage();
  
  const handleNavClick = () => {
    if (isMobile && onCloseMobile) {
      onCloseMobile();
    }
  };

  const isActive = (path: string) => location.pathname === path;

  // Force re-render when language changes
  React.useEffect(() => {
    // This is just to make sure the component re-renders when language changes
  }, [language]);

  return (
    <div className={`fixed top-0 ${language === "ar" ? "right-0" : "left-0"} h-full bg-white border-r border-gray-200 w-64 py-6 px-4 space-y-6 z-20 overflow-y-auto`}>
      <div className="space-y-1">
        <h2 className="mb-2 px-3 text-lg font-semibold tracking-tight">
          {t("dashboard.title")}
        </h2>
        {isAdmin && (
          <NavItem
            to="/dashboard"
            icon={<LayoutDashboard className="h-5 w-5" />}
            label={t("dashboard.overview")}
            isActive={isActive("/dashboard")}
            onClick={handleNavClick}
          />
        )}
        <NavItem
          to="/dashboard/orders"
          icon={<ShoppingCart className="h-5 w-5" />}
          label={t("dashboard.orders")}
          isActive={isActive("/dashboard/orders")}
          onClick={handleNavClick}
        />
        <NavItem
          to="/dashboard/products"
          icon={<Package className="h-5 w-5" />}
          label={t("dashboard.products")}
          isActive={isActive("/dashboard/products")}
          onClick={handleNavClick}
        />
        {isAdmin && (
          <>
            <NavItem
              to="/dashboard/popular"
              icon={<TrendingUp className="h-5 w-5" />}
              label={t("dashboard.popular")}
              isActive={isActive("/dashboard/popular")}
              onClick={handleNavClick}
            />
            <NavItem
              to="/dashboard/users"
              icon={<Users className="h-5 w-5" />}
              label={t("dashboard.users")}
              isActive={isActive("/dashboard/users")}
              onClick={handleNavClick}
            />
          </>
        )}
        <NavItem
          to="/dashboard/quick-scan"
          icon={<Scan className="h-5 w-5 " />}
          label={t("dashboard.quickScan")}
          isActive={isActive("/dashboard/quick-scan")}
          onClick={handleNavClick}
        />
      </div>
    </div>
  );
};

export default Sidebar;
