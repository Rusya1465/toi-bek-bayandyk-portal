
import { useState, useEffect, useRef } from "react";
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
  
  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Block scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add('mobile-menu-open');
    } else {
      document.body.classList.remove('mobile-menu-open');
    }
    
    // Cleanup on unmount
    return () => {
      document.body.classList.remove('mobile-menu-open');
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

  // Simple toggle function
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center" onClick={() => setIsMenuOpen(false)}>
            <span className="inline-block font-bold text-xl text-kyrgyz-red">
              ToiBek
            </span>
          </Link>
        </div>
        
        {/* Desktop nav */}
        <DesktopNav isActive={isActive} isAdmin={isAdmin} />
        
        {/* Right navigation (languages, profile) */}
        <div className="flex items-center space-x-2 md:space-x-4">
          <LanguageSwitch />
          
          {/* User profile */}
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

          {/* Mobile menu button - simplified */}
          <Button
            ref={menuButtonRef}
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={toggleMenu}
            aria-label={isMenuOpen ? t("nav.closeMenu") : t("nav.openMenu")}
            aria-expanded={isMenuOpen}
            type="button"
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
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
