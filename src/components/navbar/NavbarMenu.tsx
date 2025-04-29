
import { useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  User, 
  LogOut, 
  Plus, 
  Settings, 
  Heart,
  History,
  ShoppingBag,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/contexts/LanguageContext";

interface NavbarMenuProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
  toggleMenu: (e?: React.MouseEvent | React.TouchEvent) => void;
  isAdmin: boolean;
  isPartner: boolean;
  handleSignOut: () => void;
  user: any;
}

const NavbarMenu = ({
  isMenuOpen,
  setIsMenuOpen,
  toggleMenu,
  isAdmin,
  isPartner,
  handleSignOut,
  user,
}: NavbarMenuProps) => {
  const location = useLocation();
  const { t } = useTranslation();
  const menuRef = useRef<HTMLDivElement>(null);

  // Handle touch events and close menu when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent | TouchEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        console.log("Outside click detected, closing menu");
        setIsMenuOpen(false);
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isMenuOpen) {
        console.log("Escape key pressed, closing menu");
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      // Use capture phase to ensure we get the event first
      document.addEventListener('mousedown', handleOutsideClick, { capture: true });
      document.addEventListener('touchstart', handleOutsideClick, { capture: true, passive: true });
      document.addEventListener('keydown', handleEscapeKey);
      
      // Log that listeners are added
      console.log("Menu event listeners added");
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick, { capture: true });
      document.removeEventListener('touchstart', handleOutsideClick, { capture: true });
      document.removeEventListener('keydown', handleEscapeKey);
      console.log("Menu event listeners removed");
    };
  }, [isMenuOpen, setIsMenuOpen]);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // We always render the menu but control visibility with CSS
  return (
    <div 
      id="mobile-menu"
      ref={menuRef}
      className={cn(
        "mobile-menu", 
        isMenuOpen ? "mobile-menu-visible animate-fade-in" : "mobile-menu-hidden",
        "md:hidden"
      )}
      aria-hidden={!isMenuOpen}
      role="dialog"
      aria-modal="true"
      aria-labelledby="mobile-menu-heading"
    >
      <div className="container py-6 space-y-6 overflow-y-auto h-full pb-safe">
        <h2 id="mobile-menu-heading" className="sr-only">{t("nav.mobileMenu")}</h2>
        <nav className="space-y-4">
          <Link
            to="/"
            className={cn(
              "flex items-center py-3 px-2 text-lg font-medium rounded-md transition-colors", 
              isActive("/") ? "text-primary bg-primary/5" : "text-foreground hover:bg-muted/50"
            )}
            onClick={() => setIsMenuOpen(false)}
          >
            {t("nav.home")}
          </Link>
          <Link
            to="/catalog"
            className={cn(
              "flex items-center py-3 px-2 text-lg font-medium rounded-md transition-colors", 
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
                  "flex items-center py-3 px-2 text-base font-medium rounded-md transition-colors", 
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
                  "flex items-center py-3 px-2 text-base font-medium rounded-md transition-colors", 
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
                  "flex items-center py-3 px-2 text-base font-medium rounded-md transition-colors", 
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
                  "flex items-center py-3 px-2 text-base font-medium rounded-md transition-colors", 
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
                  "flex items-center py-3 px-2 text-base font-medium rounded-md transition-colors", 
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
                  "flex items-center py-3 px-2 text-base font-medium rounded-md transition-colors", 
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
          <button
            onClick={() => {
              handleSignOut();
              setIsMenuOpen(false);
            }}
            className="w-full flex items-center justify-center h-12 px-4 py-2 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground touch-manipulation"
          >
            <LogOut className="mr-2 h-4 w-4" />
            {t("nav.logout")}
          </button>
        ) : (
          <Link
            to="/auth"
            onClick={() => setIsMenuOpen(false)}
            className="w-full flex items-center justify-center h-12 px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 touch-manipulation"
          >
            <User className="mr-2 h-4 w-4" />
            {t("nav.login")}
          </Link>
        )}
      </div>
    </div>
  );
};

export default NavbarMenu;
