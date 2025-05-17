
import React, { createContext, useState, useContext, useEffect } from "react";

// Define language types and context type
type Language = "en" | "ar" | "fr";

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
};

// Create the context
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation data
const translations = {
  en: {
    "settings.title": "Settings",
    "settings.description": "Manage your account settings and preferences.",
    "settings.tabs.account": "Account",
    "settings.tabs.notifications": "Notifications",
    "settings.tabs.store": "Store",
    "settings.tabs.language": "Language",
    "settings.account.title": "Account Settings",
    "settings.account.description": "Manage your account preferences and settings.",
    "settings.account.darkMode": "Dark Mode",
    "settings.account.darkMode.description": "Enable dark mode for a different visual experience.",
    "settings.account.changePassword": "Change Password",
    "settings.account.saveChanges": "Save Changes",
    "settings.notifications.title": "Notification Settings",
    "settings.notifications.description": "Manage how you receive notifications.",
    "settings.notifications.email": "Email Notifications",
    "settings.notifications.email.description": "Receive notifications about orders and products via email.",
    "settings.notifications.push": "Push Notifications",
    "settings.notifications.push.description": "Receive push notifications for important updates.",
    "settings.store.title": "Store Settings",
    "settings.store.description": "Manage your store preferences.",
    "settings.store.timeZone": "Store Time Zone",
    "settings.store.currency": "Currency",
    "settings.language.title": "Language Settings",
    "settings.language.description": "Choose your preferred language for the application.",
    "settings.language.select": "Select Language",
    "settings.saved": "Settings saved",
    "settings.saved.description": "Your settings have been saved successfully.",
    "languages.english": "English",
    "languages.arabic": "العربية",
    "languages.french": "Français",
    "dashboard.title": "Dashboard",
    "dashboard.overview": "Overview",
    "dashboard.orders": "Orders",
    "dashboard.products": "Products",
    "dashboard.popular": "Popular Items",
    "dashboard.users": "User Management",
    "dashboard.quickScan": "Quick Scan",
    "navbar.profile": "My Profile",
    "navbar.admin": "Admin",
    "navbar.profileSettings": "Profile Settings",
    "navbar.accountSettings": "Account Settings",
    "navbar.logout": "Logout",
    "popularItems.title": "Popular Items",
    "popularItems.description": "Top selling products in your store",
    "popularItems.loading": "Loading products...",
    "popularItems.noProducts": "No popular products found",
    "popularItems.eligible": "Eligible"
  },
  ar: {
    "settings.title": "الإعدادات",
    "settings.description": "إدارة إعدادات وتفضيلات حسابك.",
    "settings.tabs.account": "الحساب",
    "settings.tabs.notifications": "الإشعارات",
    "settings.tabs.store": "المتجر",
    "settings.tabs.language": "اللغة",
    "settings.account.title": "إعدادات الحساب",
    "settings.account.description": "إدارة تفضيلات وإعدادات حسابك.",
    "settings.account.darkMode": "الوضع المظلم",
    "settings.account.darkMode.description": "تمكين الوضع المظلم لتجربة بصرية مختلفة.",
    "settings.account.changePassword": "تغيير كلمة المرور",
    "settings.account.saveChanges": "حفظ التغييرات",
    "settings.notifications.title": "إعدادات الإشعارات",
    "settings.notifications.description": "إدارة كيفية تلقي الإشعارات.",
    "settings.notifications.email": "إشعارات البريد الإلكتروني",
    "settings.notifications.email.description": "تلقي إشعارات حول الطلبات والمنتجات عبر البريد الإلكتروني.",
    "settings.notifications.push": "إشعارات الدفع",
    "settings.notifications.push.description": "تلقي إشعارات فورية للتحديثات المهمة.",
    "settings.store.title": "إعدادات المتجر",
    "settings.store.description": "إدارة تفضيلات متجرك.",
    "settings.store.timeZone": "المنطقة الزمنية للمتجر",
    "settings.store.currency": "العملة",
    "settings.language.title": "إعدادات اللغة",
    "settings.language.description": "اختر لغتك المفضلة للتطبيق.",
    "settings.language.select": "اختر اللغة",
    "settings.saved": "تم حفظ الإعدادات",
    "settings.saved.description": "تم حفظ إعداداتك بنجاح.",
    "languages.english": "English",
    "languages.arabic": "العربية",
    "languages.french": "Français",
    "dashboard.title": "لوحة التحكم",
    "dashboard.overview": "نظرة عامة",
    "dashboard.orders": "الطلبات",
    "dashboard.products": "المنتجات",
    "dashboard.popular": "العناصر الشائعة",
    "dashboard.users": "إدارة المستخدمين",
    "dashboard.quickScan": "المسح السريع",
    "navbar.profile": "ملفي الشخصي",
    "navbar.admin": "مدير",
    "navbar.profileSettings": "إعدادات الملف الشخصي",
    "navbar.accountSettings": "إعدادات الحساب",
    "navbar.logout": "تسجيل الخروج",
    "popularItems.title": "العناصر الشائعة",
    "popularItems.description": "المنتجات الأكثر مبيعًا في متجرك",
    "popularItems.loading": "جاري تحميل المنتجات...",
    "popularItems.noProducts": "لا توجد منتجات شائعة",
    "popularItems.eligible": "مؤهل"
  },
  fr: {
    "settings.title": "Paramètres",
    "settings.description": "Gérez vos paramètres et préférences de compte.",
    "settings.tabs.account": "Compte",
    "settings.tabs.notifications": "Notifications",
    "settings.tabs.store": "Magasin",
    "settings.tabs.language": "Langue",
    "settings.account.title": "Paramètres du compte",
    "settings.account.description": "Gérez vos préférences et paramètres de compte.",
    "settings.account.darkMode": "Mode sombre",
    "settings.account.darkMode.description": "Activez le mode sombre pour une expérience visuelle différente.",
    "settings.account.changePassword": "Changer le mot de passe",
    "settings.account.saveChanges": "Enregistrer les modifications",
    "settings.notifications.title": "Paramètres de notification",
    "settings.notifications.description": "Gérez comment vous recevez les notifications.",
    "settings.notifications.email": "Notifications par e-mail",
    "settings.notifications.email.description": "Recevez des notifications sur les commandes et les produits par e-mail.",
    "settings.notifications.push": "Notifications push",
    "settings.notifications.push.description": "Recevez des notifications push pour les mises à jour importantes.",
    "settings.store.title": "Paramètres du magasin",
    "settings.store.description": "Gérez les préférences de votre magasin.",
    "settings.store.timeZone": "Fuseau horaire du magasin",
    "settings.store.currency": "Devise",
    "settings.language.title": "Paramètres de langue",
    "settings.language.description": "Choisissez votre langue préférée pour l'application.",
    "settings.language.select": "Sélectionner la langue",
    "settings.saved": "Paramètres enregistrés",
    "settings.saved.description": "Vos paramètres ont été enregistrés avec succès.",
    "languages.english": "English",
    "languages.arabic": "العربية",
    "languages.french": "Français",
    "dashboard.title": "Tableau de bord",
    "dashboard.overview": "Aperçu",
    "dashboard.orders": "Commandes",
    "dashboard.products": "Produits",
    "dashboard.popular": "Articles populaires",
    "dashboard.users": "Gestion des utilisateurs",
    "dashboard.quickScan": "Scan rapide",
    "navbar.profile": "Mon Profil",
    "navbar.admin": "Admin",
    "navbar.profileSettings": "Paramètres du profil",
    "navbar.accountSettings": "Paramètres du compte",
    "navbar.logout": "Déconnexion",
    "popularItems.title": "Articles populaires",
    "popularItems.description": "Produits les plus vendus dans votre boutique",
    "popularItems.loading": "Chargement des produits...",
    "popularItems.noProducts": "Aucun produit populaire trouvé",
    "popularItems.eligible": "Éligible"
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize with the language from localStorage or default to English
  const [language, setLanguageState] = useState<Language>(() => {
    const savedSettings = localStorage.getItem("userSettings");
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        if (settings.language && ["en", "ar", "fr"].includes(settings.language)) {
          return settings.language as Language;
        }
      } catch (error) {
        console.error("Error parsing language settings", error);
      }
    }
    return "en";
  });

  // Update language and save to localStorage
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    
    // Update the language in userSettings in localStorage
    const savedSettings = localStorage.getItem("userSettings");
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        settings.language = lang;
        localStorage.setItem("userSettings", JSON.stringify(settings));
      } catch (error) {
        console.error("Error updating language in settings", error);
      }
    }
    
    // Update document direction for RTL languages
    if (lang === "ar") {
      document.documentElement.dir = "rtl";
    } else {
      document.documentElement.dir = "ltr";
    }
  };

  // Function to get translation
  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  // Set initial document direction on mount
  useEffect(() => {
    if (language === "ar") {
      document.documentElement.dir = "rtl";
    } else {
      document.documentElement.dir = "ltr";
    }
  }, []);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use the language context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
