import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "@/contexts/LanguageContext";
import { Loader } from "lucide-react";
import { ServicesPanel } from "@/components/partner/ServicesPanel";

const ProfilePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, loading } = useAuth();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("profile");
  
  useEffect(() => {
    if (location.pathname.includes("/settings")) {
      setActiveTab("settings");
    } else if (location.pathname.includes("/favorites")) {
      setActiveTab("favorites");
    } else if (location.pathname.includes("/history")) {
      setActiveTab("history");
    } else if (location.pathname.includes("/services")) {
      setActiveTab("services");
    } else {
      setActiveTab("profile");
    }
  }, [location.pathname]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    if (value === "profile") {
      navigate("/profile");
    } else {
      navigate(`/profile/${value}`);
    }
  };

  const canManageServices = profile && (profile.role === "partner" || profile.role === "admin");

  const getRoleName = (role: string) => {
    return t(`profile.roles.${role}`);
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh]">
        <Loader className="h-10 w-10 animate-spin mb-2" />
        <p className="text-muted-foreground">{t("common.loading")}</p>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">{t("profile.title")}</h1>
      
      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">{t("profile.tabs.profile")}</TabsTrigger>
          <TabsTrigger value="settings">{t("profile.tabs.settings")}</TabsTrigger>
          <TabsTrigger value="favorites">{t("profile.tabs.favorites")}</TabsTrigger>
          <TabsTrigger value="history">{t("profile.tabs.history")}</TabsTrigger>
          {canManageServices && <TabsTrigger value="services">{t("profile.tabs.services")}</TabsTrigger>}
        </TabsList>
        
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("profile.myProfile")}</CardTitle>
              <CardDescription>{t("profile.profileDescription")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">{t("profile.fullName")}:</span>
                  <span>{profile?.full_name || t("profile.notSpecified")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">{t("profile.email")}:</span>
                  <span>{user?.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">{t("profile.phone")}:</span>
                  <span>{profile?.phone || t("profile.notSpecified")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">{t("profile.role")}:</span>
                  <span>{profile?.role ? getRoleName(profile.role) : t("profile.notSpecified")}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>{t("profile.settingsTitle")}</CardTitle>
              <CardDescription>{t("profile.settingsDescription")}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>{t("profile.comingSoon")}</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="favorites">
          <Card>
            <CardHeader>
              <CardTitle>{t("profile.favoritesTitle")}</CardTitle>
              <CardDescription>{t("profile.favoritesDescription")}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>{t("profile.comingSoon")}</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>{t("profile.historyTitle")}</CardTitle>
              <CardDescription>{t("profile.historyDescription")}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>{t("profile.comingSoon")}</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        {canManageServices && (
          <TabsContent value="services">
            <ServicesPanel />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default ProfilePage;
