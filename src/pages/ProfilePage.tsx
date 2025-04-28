import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import { User, Edit, Loader, Heart, Clock, ShoppingBag, X } from "lucide-react";
import { cn } from "@/lib/utils";
import EmptyState from "@/components/EmptyState";
import { Link } from "react-router-dom";

const ProfilePage = () => {
  const { user, profile, updateProfile, isProfileLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || "",
    phone: profile?.phone || "",
    avatar_url: profile?.avatar_url || "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await updateProfile({
        full_name: formData.full_name,
        phone: formData.phone,
        avatar_url: formData.avatar_url,
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleCancel = () => {
    setFormData({
      full_name: profile?.full_name || "",
      phone: profile?.phone || "",
      avatar_url: profile?.avatar_url || "",
    });
    setIsEditing(false);
  };
  
  const isPartner = profile?.role === "partner" || profile?.role === "admin";
  const isAdmin = profile?.role === "admin";

  return (
    <div className="container py-8">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Жеке кабинет</h1>
          <p className="text-muted-foreground">
            Жеке маалыматтарыңыз жана тапшырыктарыңыз
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Профиль</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span className="hidden sm:inline">Тарых</span>
            </TabsTrigger>
            <TabsTrigger value="favorites" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              <span className="hidden sm:inline">Тандалмалар</span>
            </TabsTrigger>
            {isPartner && (
              <TabsTrigger value="services" className="flex items-center gap-2">
                <ShoppingBag className="h-4 w-4" />
                <span className="hidden sm:inline">Кызматтар</span>
              </TabsTrigger>
            )}
            {isAdmin && (
              <TabsTrigger value="admin" className="flex items-center gap-2">
                <ShoppingBag className="h-4 w-4" />
                <span className="hidden sm:inline">Админ</span>
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Жеке маалымат</CardTitle>
                {!isEditing && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setIsEditing(true)}
                    className="flex items-center"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Өзгөртүү
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex flex-col items-center mb-6">
                      <Avatar className="h-24 w-24 mb-3">
                        {formData.avatar_url ? (
                          <AvatarImage src={formData.avatar_url} alt={formData.full_name} />
                        ) : null}
                        <AvatarFallback className={cn(
                          "text-2xl text-background",
                          isAdmin ? "bg-red-500" : 
                          isPartner ? "bg-purple-500" : 
                          "bg-kyrgyz-yellow"
                        )}>
                          {formData.full_name
                            ? formData.full_name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase()
                                .slice(0, 2)
                            : "КБ"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="space-y-1">
                        <Label htmlFor="avatar_url">Аватар URL</Label>
                        <Input
                          id="avatar_url"
                          value={formData.avatar_url}
                          onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
                          className="max-w-md"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="full_name">Толук аты-жөнү</Label>
                      <Input
                        id="full_name"
                        value={formData.full_name}
                        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        value={user?.email || ""}
                        disabled
                        className="bg-muted"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Электрондук почтаны өзгөртүү мүмкүн эмес
                      </p>
                    </div>
                    
                    <div className="space-y-1">
                      <Label htmlFor="phone">Телефон</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+996 XXX XXX XXX"
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <Label htmlFor="role">Колдонуучу ролу</Label>
                      <Input
                        id="role"
                        value={profile?.role === "admin" 
                          ? "Администратор" 
                          : profile?.role === "partner"
                          ? "Өнөктөш"
                          : "Колдонуучу"}
                        disabled
                        className="bg-muted"
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={handleCancel}
                        disabled={isSubmitting}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Жокко чыгаруу
                      </Button>
                      <Button 
                        type="submit"
                        disabled={isSubmitting || isProfileLoading}
                      >
                        {isSubmitting || isProfileLoading ? (
                          <>
                            <Loader className="h-4 w-4 mr-2 animate-spin" />
                            Сакталууда...
                          </>
                        ) : (
                          "Сактоо"
                        )}
                      </Button>
                    </div>
                  </form>
                ) : isProfileLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader className="h-8 w-8 animate-spin" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex flex-col items-center mb-6">
                      <Avatar className="h-24 w-24 mb-3">
                        {profile?.avatar_url ? (
                          <AvatarImage src={profile.avatar_url} alt={profile.full_name || ""} />
                        ) : null}
                        <AvatarFallback className={cn(
                          "text-2xl text-background",
                          isAdmin ? "bg-red-500" : 
                          isPartner ? "bg-purple-500" : 
                          "bg-kyrgyz-yellow"
                        )}>
                          {profile?.full_name
                            ? profile.full_name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase()
                                .slice(0, 2)
                            : "КБ"}
                        </AvatarFallback>
                      </Avatar>
                      <h3 className="text-xl font-medium">{profile?.full_name}</h3>
                      <p className="text-muted-foreground">
                        {profile?.role === "admin" 
                          ? "Администратор" 
                          : profile?.role === "partner"
                          ? "Өнөктөш"
                          : "Колдонуучу"}
                      </p>
                    </div>

                    <div className="grid gap-2">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-muted-foreground">Email</span>
                        <span>{user?.email}</span>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="grid gap-2">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-muted-foreground">Телефон номери</span>
                        <span>{profile?.phone || "Көрсөтүлгөн эмес"}</span>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="grid gap-2">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-muted-foreground">Аккаунт түзүлгөн</span>
                        <span>{user?.created_at ? new Date(user.created_at).toLocaleDateString('kg-KG') : "—"}</span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Тарых</CardTitle>
              </CardHeader>
              <CardContent>
                <EmptyState 
                  title="Тарых бош"
                  description="Сиз али заказ бергенде же бронь кылганда жок"
                  icon={Clock}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="favorites" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Тандалмалар</CardTitle>
              </CardHeader>
              <CardContent>
                <EmptyState 
                  title="Тандалмалар бош"
                  description="Сиз али эч нерсени тандалмаларга кошкон жоксуз"
                  icon={Heart}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {isPartner && (
            <TabsContent value="services" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Менин кызматтарым</CardTitle>
                </CardHeader>
                <CardContent>
                  <EmptyState 
                    title="Кызматтар табылган жок"
                    description="Сиз али эч кандай кызмат кошо элексиз"
                    icon={ShoppingBag}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {isAdmin && (
            <TabsContent value="admin" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Админ башкаруу</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button asChild>
                    <Link to="/admin">
                      Админ панелине өтүү
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default ProfilePage;
