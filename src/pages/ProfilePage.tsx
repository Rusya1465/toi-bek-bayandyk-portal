
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { Loader } from "lucide-react";
import { ServicesPanel } from "@/components/partner/ServicesPanel";
import { useToast } from "@/components/ui/use-toast";

const ProfilePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, loading } = useAuth();
  const { toast } = useToast();
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

  // Check if user has partner or admin role
  const canManageServices = profile && (profile.role === "partner" || profile.role === "admin");

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh]">
        <Loader className="h-10 w-10 animate-spin mb-2" />
        <p className="text-muted-foreground">Жүктөлүүдө...</p>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Жеке кабинет</h1>
      
      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">Профиль</TabsTrigger>
          <TabsTrigger value="settings">Жөндөөлөр</TabsTrigger>
          <TabsTrigger value="favorites">Тандалмалар</TabsTrigger>
          <TabsTrigger value="history">Тарых</TabsTrigger>
          {canManageServices && <TabsTrigger value="services">Кызматтарым</TabsTrigger>}
        </TabsList>
        
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Менин профилим</CardTitle>
              <CardDescription>
                Жеке маалыматтарыңыз жөнүндө негизги маалымат.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">Аты-жөнүңүз:</span>
                  <span>{profile?.full_name || 'Көрсөтүлгөн эмес'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Электрондук почта:</span>
                  <span>{user?.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Телефон:</span>
                  <span>{profile?.phone || 'Көрсөтүлгөн эмес'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Роль:</span>
                  <span>
                    {profile?.role === 'admin' ? 'Администратор' : 
                     profile?.role === 'partner' ? 'Өнөктөш' : 
                     'Колдонуучу'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Профиль жөндөөлөрү</CardTitle>
              <CardDescription>
                Профилиңизди жөндөө үчүн төмөндөгү форманы толтуруңуз.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Азырынча бул секция жеткиликтүү эмес.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="favorites">
          <Card>
            <CardHeader>
              <CardTitle>Тандалмалар</CardTitle>
              <CardDescription>
                Сиз сактаган бардык кызматтар жана жайлар.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Азырынча бул секция жеткиликтүү эмес.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Тарых</CardTitle>
              <CardDescription>
                Сиз караган жана колдонгон кызматтардын тарыхы.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Азырынча бул секция жеткиликтүү эмес.</p>
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
