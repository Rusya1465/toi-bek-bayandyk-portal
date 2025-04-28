
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, User, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { LanguageSwitch } from "@/components/LanguageSwitch";
import { useTranslation } from "@/contexts/LanguageContext";
import { useIsMobile } from "@/hooks/use-mobile";
import UserDropdown from "@/components/navbar/UserDropdown";
import DesktopNav from "@/components/navbar/DesktopNav";
import NavbarMenu from "@/components/navbar/NavbarMenu";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, profile, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

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

  const toggleMenu = () => {
    setIsMenuOpen(prev => !prev);
    console.log("Menu toggled, new state:", !isMenuOpen);
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
        <DesktopNav isActive={isActive} isAdmin={isAdmin} />
        
        {/* Правая часть навигации (языки, профиль) */}
        <div className="flex items-center space-x-2 md:space-x-4">
          <LanguageSwitch />
          
          {/* Профиль пользователя */}
          {loading ? (
            <div className="h-8 w-8 rounded-full bg-muted animate-pulse"></div>
          ) : user ? (
            <UserDropdown 
              user={user}
              profile={profile}
              handleSignOut={handleSignOut}
              isAdmin={isAdmin}
              isPartner={isPartner}
              navigate={navigate}
            />
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
            onClick={toggleMenu}
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

      {/* Мобильное меню */}
      <NavbarMenu 
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        isAdmin={isAdmin}
        isPartner={isPartner}
        handleSignOut={handleSignOut}
        user={user}
      />
    </header>
  );
};

export default Navbar;
