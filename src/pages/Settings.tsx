
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { Languages, Flag } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface UserSettings {
  darkMode: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
  storeTimeZone: string;
  currency: string;
  language: string;
}

const Settings: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  
  const [settings, setSettings] = useState<UserSettings>({
    darkMode: false,
    emailNotifications: true,
    pushNotifications: true,
    storeTimeZone: "Africa/Casablanca",
    currency: "MAD",
    language: language
  });
  
  const { toast } = useToast();

  useEffect(() => {
    // Load settings from localStorage if available
    const storedSettings = localStorage.getItem("userSettings");
    if (storedSettings) {
      try {
        setSettings(JSON.parse(storedSettings));
      } catch (error) {
        console.error("Error parsing settings", error);
      }
    }
  }, []);

  useEffect(() => {
    // Update settings when language changes from context
    setSettings(prevSettings => ({
      ...prevSettings,
      language
    }));
  }, [language]);

  const saveSettings = () => {
    localStorage.setItem("userSettings", JSON.stringify(settings));
    toast({
      title: t("settings.saved"),
      description: t("settings.saved.description"),
    });
  };

  const changeLanguage = (lang: string) => {
    setLanguage(lang as "en" | "ar" | "fr");
    setSettings({ ...settings, language: lang });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t("settings.title")}</h1>
        <p className="text-gray-500">
          {t("settings.description")}
        </p>
      </div>
      
      <Tabs defaultValue="account" className="space-y-4">
        <TabsList>
          <TabsTrigger value="account">{t("settings.tabs.account")}</TabsTrigger>
          <TabsTrigger value="notifications">{t("settings.tabs.notifications")}</TabsTrigger>
          <TabsTrigger value="store">{t("settings.tabs.store")}</TabsTrigger>
          <TabsTrigger value="language">{t("settings.tabs.language")}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="account" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("settings.account.title")}</CardTitle>
              <CardDescription>
                {t("settings.account.description")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="darkMode">{t("settings.account.darkMode")}</Label>
                  <Switch
                    id="darkMode"
                    checked={settings.darkMode}
                    onCheckedChange={(checked) => 
                      setSettings({ ...settings, darkMode: checked })
                    }
                  />
                </div>
                <p className="text-sm text-gray-500">
                  {t("settings.account.darkMode.description")}
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">{t("settings.account.changePassword")}</Label>
                <Input id="password" type="password" placeholder="Enter new password" />
              </div>
              
              <div className="pt-4">
                <Button 
                  className="bg-store-DEFAULT hover:bg-store-DEFAULT/90"
                  onClick={saveSettings}
                >
                  {t("settings.account.saveChanges")}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("settings.notifications.title")}</CardTitle>
              <CardDescription>
                {t("settings.notifications.description")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="emailNotifications">{t("settings.notifications.email")}</Label>
                  <Switch
                    id="emailNotifications"
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => 
                      setSettings({ ...settings, emailNotifications: checked })
                    }
                  />
                </div>
                <p className="text-sm text-gray-500">
                  {t("settings.notifications.email.description")}
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="pushNotifications">{t("settings.notifications.push")}</Label>
                  <Switch
                    id="pushNotifications"
                    checked={settings.pushNotifications}
                    onCheckedChange={(checked) => 
                      setSettings({ ...settings, pushNotifications: checked })
                    }
                  />
                </div>
                <p className="text-sm text-gray-500">
                  {t("settings.notifications.push.description")}
                </p>
              </div>
              
              <div className="pt-4">
                <Button 
                  className="bg-store-DEFAULT hover:bg-store-DEFAULT/90"
                  onClick={saveSettings}
                >
                  {t("settings.account.saveChanges")}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="store" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("settings.store.title")}</CardTitle>
              <CardDescription>
                {t("settings.store.description")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="timeZone">{t("settings.store.timeZone")}</Label>
                <select
                  id="timeZone"
                  className="w-full p-2 border rounded-md"
                  value={settings.storeTimeZone}
                  onChange={(e) => 
                    setSettings({ ...settings, storeTimeZone: e.target.value })
                  }
                >
                  <option value="UTC">UTC</option>
                  <option value="Africa/Casablanca">Casablanca (GMT+1)</option>
                  <option value="America/New_York">Eastern Time</option>
                  <option value="America/Chicago">Central Time</option>
                  <option value="America/Denver">Mountain Time</option>
                  <option value="America/Los_Angeles">Pacific Time</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="currency">{t("settings.store.currency")}</Label>
                <select
                  id="currency"
                  className="w-full p-2 border rounded-md"
                  value={settings.currency}
                  onChange={(e) => 
                    setSettings({ ...settings, currency: e.target.value })
                  }
                >
                  <option value="USD">USD - US Dollar</option>
                  <option value="MAD">MAD - Moroccan Dirham (DH)</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                  <option value="CAD">CAD - Canadian Dollar</option>
                  <option value="AUD">AUD - Australian Dollar</option>
                </select>
              </div>
              
              <div className="pt-4">
                <Button 
                  className="bg-store-DEFAULT hover:bg-store-DEFAULT/90"
                  onClick={saveSettings}
                >
                  {t("settings.account.saveChanges")}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="language" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("settings.language.title")}</CardTitle>
              <CardDescription>
                {t("settings.language.description")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col space-y-4">
                <Label className="text-base">{t("settings.language.select")}</Label>
                <div className="flex flex-wrap gap-3">
                  <Button 
                    variant={language === "en" ? "default" : "outline"}
                    onClick={() => changeLanguage("en")}
                    className="flex items-center space-x-2"
                  >
                    <span className="w-6 h-6 rounded-full overflow-hidden flex items-center justify-center bg-blue-100">
                      🇬🇧
                    </span>
                    <span>{t("languages.english")}</span>
                  </Button>
                  
                  <Button 
                    variant={language === "ar" ? "default" : "outline"}
                    onClick={() => changeLanguage("ar")}
                    className="flex items-center space-x-2"
                  >
                    <span className="w-6 h-6 rounded-full overflow-hidden flex items-center justify-center bg-blue-100">
                      🇸🇦
                    </span>
                    <span>{t("languages.arabic")}</span>
                  </Button>
                  
                  <Button 
                    variant={language === "fr" ? "default" : "outline"}
                    onClick={() => changeLanguage("fr")}
                    className="flex items-center space-x-2"
                  >
                    <span className="w-6 h-6 rounded-full overflow-hidden flex items-center justify-center bg-blue-100">
                      🇫🇷
                    </span>
                    <span>{t("languages.french")}</span>
                  </Button>
                </div>
              </div>
              
              <div className="pt-4">
                <Button 
                  className="bg-store-DEFAULT hover:bg-store-DEFAULT/90"
                  onClick={saveSettings}
                >
                  {t("settings.account.saveChanges")}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
