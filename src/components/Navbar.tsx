
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Menu, 
  User, 
  LogOut, 
  Plus, 
  Edit, 
  Settings, 
  Heart,
  History,
  ShoppingBag,
  UserCog,
  X 
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { LanguageSwitch } from "@/components/LanguageSwitch";
import { useTranslation } from "@/contexts/LanguageContext";
import { useIsMobile } from "@/hooks/use-mobile";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, profile, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  
  // Закрываем мобильное меню при изменении маршрута
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);
  
  // Блокируем прокрутку страницы, когда мобильное меню открыто
  useEffect(() => {
    if (isMenuOpen && isMobile) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [isMenuOpen, isMobile]);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        description: t("forms.notifications.loginSuccess"),
      });
      navigate("/");
    } catch (error) {
      toast({
        variant: "destructive",
        description: t("common.error"),
      });
    }
  };

  const isAdmin = profile?.role === "admin";
  const isPartner = profile?.role === "partner" || isAdmin;

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const getInitials = (name: string | null) => {
    if (!name) return "КБ";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Логотип */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center" onClick={() => setIsMenuOpen(false)}>
            <span className="inline-block font-bold text-xl text-kyrgyz-red">
              ToiBek
            </span>
          </Link>
        </div>
        
        {/* Десктопная навигация */}
        <nav className="hidden md:flex flex-1 items-center justify-center">
          <div className="flex items-center space-x-4 lg:space-x-6">
            <Link
              to="/"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                isActive("/") ? "text-primary" : "text-muted-foreground"
              )}
            >
              {t("nav.home")}
            </Link>
            <Link
              to="/catalog"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                isActive("/catalog") ? "text-primary" : "text-muted-foreground"
              )}
            >
              {t("nav.catalog")}
            </Link>
            {isAdmin && (
              <Link
                to="/admin"
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  isActive("/admin") ? "text-primary" : "text-muted-foreground"
                )}
              >
                {t("nav.admin")}
              </Link>
            )}
          </div>
        </nav>
        
        {/* Правая часть навигации (языки, профиль) */}
        <div className="flex items-center space-x-2 md:space-x-4">
          <LanguageSwitch />
          
          {/* Профиль пользователя */}
          {loading ? (
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-muted">...</AvatarFallback>
            </Avatar>
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-9 w-9 md:h-10 md:w-10 rounded-full"
                >
                  <Avatar className="h-9 w-9 md:h-10 md:w-10 border">
                    {profile?.avatar_url ? (
                      <AvatarImage src={profile.avatar_url} alt={profile.full_name || t("nav.profile")} />
                    ) : null}
                    <AvatarFallback className={cn(
                      "text-background",
                      isAdmin ? "bg-red-500" : 
                      isPartner ? "bg-purple-500" : 
                      "bg-kyrgyz-yellow"
                    )}>
                      {getInitials(profile?.full_name)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    {profile?.full_name && (
                      <p className="font-medium">{profile.full_name}</p>
                    )}
                    <p className="text-xs text-muted-foreground truncate w-[180px]">
                      {user.email}
                    </p>
                    {profile?.role && (
                      <p className="text-xs font-medium text-primary">
                        {profile.role === "admin" 
                          ? t("nav.admin") 
                          : profile.role === "partner"
                          ? "Өнөктөш"
                          : t("nav.profile")}
                      </p>
                    )}
                  </div>
                </div>
                <DropdownMenuSeparator />

                <DropdownMenuItem asChild>
                  <Link to="/profile" className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    <span>{t("nav.profile")}</span>
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuItem asChild>
                  <Link to="/profile/settings" className="flex items-center">
                    <UserCog className="mr-2 h-4 w-4" />
                    <span>{t("nav.settings")}</span>
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuItem asChild>
                  <Link to="/profile/favorites" className="flex items-center">
                    <Heart className="mr-2 h-4 w-4" />
                    <span>{t("nav.favorites")}</span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link to="/profile/history" className="flex items-center">
                    <History className="mr-2 h-4 w-4" />
                    <span>{t("nav.history")}</span>
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                
                {isPartner && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link to="/create-event" className="flex items-center">
                        <Plus className="mr-2 h-4 w-4" />
                        <span>{t("nav.createEvent")}</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/apply-event" className="flex items-center">
                        <Edit className="mr-2 h-4 w-4" />
                        <span>{t("nav.applyEvent")}</span>
                      </Link>
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem asChild>
                      <Link to="/profile/services" className="flex items-center">
                        <ShoppingBag className="mr-2 h-4 w-4" />
                        <span>{t("nav.services")}</span>
                      </Link>
                    </DropdownMenuItem>
                    
                    <DropdownMenuSeparator />
                  </>
                )}
                
                {isAdmin && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link to="/admin" className="flex items-center">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>{t("nav.admin")}</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}

                <DropdownMenuItem onClick={handleSignOut} className="flex items-center">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>{t("nav.logout")}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button 
              variant="default" 
              onClick={() => navigate("/auth")}
              className="text-sm h-9 px-3 md:px-4 md:h-10"
            >
              {t("nav.login")}
            </Button>
          )}

          {/* Кнопка мобильного меню */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Закрыть меню" : "Открыть меню"}
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Мобильное меню - переработанный дизайн */}
      {isMenuOpen && (
        <div className="fixed inset-0 top-16 z-40 bg-background animate-fade-in border-t overflow-y-auto pb-safe md:hidden">
          <div className="container py-6 space-y-6">
            <nav className="space-y-4">
              <Link
                to="/"
                className={cn(
                  "flex items-center py-2 px-1 text-lg font-medium rounded-md transition-colors", 
                  isActive("/") ? "text-primary bg-primary/5" : "text-foreground hover:bg-muted/50"
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                {t("nav.home")}
              </Link>
              <Link
                to="/catalog"
                className={cn(
                  "flex items-center py-2 px-1 text-lg font-medium rounded-md transition-colors", 
                  isActive("/catalog") ? "text-primary bg-primary/5" : "text-foreground hover:bg-muted/50"
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                {t("nav.catalog")}
              </Link>
              
              {user && (
                <>
                  <div className="h-px bg-border my-4"></div>
                  <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider px-1">
                    {t("nav.profile")}
                  </p>
                  
                  <Link
                    to="/profile"
                    className={cn(
                      "flex items-center py-2 px-1 text-base font-medium rounded-md transition-colors", 
                      isActive("/profile") ? "text-primary bg-primary/5" : "text-foreground hover:bg-muted/50"
                    )}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="mr-3 h-5 w-5" />
                    {t("nav.profile")}
                  </Link>
                  <Link
                    to="/profile/favorites"
                    className={cn(
                      "flex items-center py-2 px-1 text-base font-medium rounded-md transition-colors", 
                      isActive("/profile/favorites") ? "text-primary bg-primary/5" : "text-foreground hover:bg-muted/50"
                    )}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Heart className="mr-3 h-5 w-5" />
                    {t("nav.favorites")}
                  </Link>
                  <Link
                    to="/profile/history"
                    className={cn(
                      "flex items-center py-2 px-1 text-base font-medium rounded-md transition-colors", 
                      isActive("/profile/history") ? "text-primary bg-primary/5" : "text-foreground hover:bg-muted/50"
                    )}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <History className="mr-3 h-5 w-5" />
                    {t("nav.history")}
                  </Link>
                </>
              )}
              
              {isPartner && (
                <>
                  <div className="h-px bg-border my-4"></div>
                  <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider px-1">
                    {t("nav.services")}
                  </p>
                  
                  <Link
                    to="/create-event"
                    className={cn(
                      "flex items-center py-2 px-1 text-base font-medium rounded-md transition-colors", 
                      isActive("/create-event") ? "text-primary bg-primary/5" : "text-foreground hover:bg-muted/50"
                    )}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Plus className="mr-3 h-5 w-5" />
                    {t("nav.createEvent")}
                  </Link>
                  <Link
                    to="/profile/services"
                    className={cn(
                      "flex items-center py-2 px-1 text-base font-medium rounded-md transition-colors", 
                      isActive("/profile/services") ? "text-primary bg-primary/5" : "text-foreground hover:bg-muted/50"
                    )}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <ShoppingBag className="mr-3 h-5 w-5" />
                    {t("nav.services")}
                  </Link>
                </>
              )}
              
              {isAdmin && (
                <>
                  <div className="h-px bg-border my-4"></div>
                  <Link
                    to="/admin"
                    className={cn(
                      "flex items-center py-2 px-1 text-base font-medium rounded-md transition-colors", 
                      isActive("/admin") ? "text-primary bg-primary/5" : "text-foreground hover:bg-muted/50"
                    )}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Settings className="mr-3 h-5 w-5" />
                    {t("nav.admin")}
                  </Link>
                </>
              )}
            </nav>
            
            <div className="h-px bg-border"></div>
            
            {user ? (
              <Button
                variant="outline"
                onClick={() => {
                  handleSignOut();
                  setIsMenuOpen(false);
                }}
                className="w-full flex items-center justify-center"
              >
                <LogOut className="mr-2 h-4 w-4" />
                {t("nav.logout")}
              </Button>
            ) : (
              <Button
                variant="default"
                onClick={() => {
                  navigate("/auth");
                  setIsMenuOpen(false);
                }}
                className="w-full flex items-center justify-center"
              >
                <User className="mr-2 h-4 w-4" />
                {t("nav.login")}
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
