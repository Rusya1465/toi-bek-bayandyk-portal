
import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
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
    if (isMenuOpen) {
      setIsMenuOpen(false);
      console.log("Route changed, menu closed");
    }
  }, [location.pathname]);

  // Handle body scroll locking
  useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add('mobile-menu-open');
      console.log("Menu opened, body scroll locked");
    } else {
      document.body.classList.remove('mobile-menu-open');
      console.log("Menu closed, body scroll unlocked");
    }
    
    return () => {
      document.body.classList.remove('mobile-menu-open');
      console.log("Cleanup: body scroll restored");
    };
  }, [isMenuOpen]);

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

  const toggleMenu = useCallback((e?: React.MouseEvent) => {
    // Prevent default and stop propagation to ensure the event doesn't bubble
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    setIsMenuOpen(prevState => {
      const newState = !prevState;
      console.log("Menu toggled, new state:", newState);
      return newState;
    });
  }, []);

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
            aria-label={isMenuOpen ? t("nav.closeMenu") : t("nav.openMenu")}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Мобильное меню - always rendered but conditionally shown */}
      <NavbarMenu 
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        isAdmin={isAdmin}
        isPartner={isPartner}
        handleSignOut={handleSignOut}
        user={user}
      />
      
      {/* Backdrop for closing the menu when clicking outside */}
      {isMenuOpen && (
        <div 
          className="mobile-menu-backdrop md:hidden" 
          onClick={toggleMenu}
          aria-hidden="true"
        />
      )}
    </header>
  );
};

export default Navbar;
