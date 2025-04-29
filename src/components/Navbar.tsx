
import { useState, useEffect, useCallback, useRef } from "react";
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
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  
  // Улучшенная обработка изменения маршрута
  useEffect(() => {
    if (isMenuOpen) {
      setIsMenuOpen(false);
      console.log("Route changed, menu closed");
    }
  }, [location.pathname]);

  // Улучшенная блокировка скролла с проверкой на наличие класса
  useEffect(() => {
    if (isMenuOpen) {
      if (!document.body.classList.contains('mobile-menu-open')) {
        document.body.classList.add('mobile-menu-open');
        console.log("Menu opened, body scroll locked", document.body.classList);
      }
    } else {
      document.body.classList.remove('mobile-menu-open');
      console.log("Menu closed, body scroll unlocked", document.body.classList);
    }
    
    // Всегда очищаем при размонтировании
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

  // Полностью переработанная функция переключения меню
  const toggleMenu = useCallback((e?: React.MouseEvent | React.TouchEvent) => {
    if (e) {
      // Предотвращаем всплытие события
      e.preventDefault();
      e.stopPropagation();
    }
    
    // Используем функциональное обновление с логированием
    setIsMenuOpen(prevState => {
      const newState = !prevState;
      console.log("Menu toggled, new state:", newState, "Event type:", e?.type);
      return newState;
    });
  }, []);

  // Обработчик клика по бургеру с минимальной логикой для максимальной надежности
  const handleMenuClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    toggleMenu(e);
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

          {/* Кнопка мобильного меню - упрощена для максимальной надежности */}
          <Button
            ref={menuButtonRef}
            variant="ghost"
            size="icon"
            className="md:hidden focus-visible:ring-2 focus-visible:ring-primary"
            onClick={handleMenuClick}
            aria-label={isMenuOpen ? t("nav.closeMenu") : t("nav.openMenu")}
            aria-expanded={isMenuOpen}
            aria-haspopup="true"
            aria-controls="mobile-menu"
            data-state={isMenuOpen ? "open" : "closed"}
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
            <span className="sr-only">
              {isMenuOpen ? t("nav.closeMenu") : t("nav.openMenu")}
            </span>
          </Button>
        </div>
      </div>

      {/* Мобильное меню */}
      <NavbarMenu 
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        toggleMenu={toggleMenu}
        isAdmin={isAdmin}
        isPartner={isPartner}
        handleSignOut={handleSignOut}
        user={user}
      />
    </header>
  );
};

export default Navbar;
