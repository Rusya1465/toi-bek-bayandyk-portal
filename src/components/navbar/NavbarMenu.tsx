
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
  isAdmin: boolean;
  isPartner: boolean;
  handleSignOut: () => void;
  user: any;
}

const NavbarMenu = ({
  isMenuOpen,
  setIsMenuOpen,
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
    const handleOutsideClick = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('touchstart', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
    };
  }, [isMenuOpen, setIsMenuOpen]);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // We always render the menu but control visibility with CSS
  return (
    <div 
      ref={menuRef}
      className={cn(
        "fixed inset-0 top-16 z-40 bg-background border-t overflow-y-auto pb-safe md:hidden",
        isMenuOpen ? "block animate-fade-in" : "hidden"
      )}
      aria-hidden={!isMenuOpen}
      role="dialog"
      aria-modal="true"
    >
      <div className="container py-6 space-y-6">
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
            className="w-full flex items-center justify-center h-12 px-4 py-2 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground"
          >
            <LogOut className="mr-2 h-4 w-4" />
            {t("nav.logout")}
          </button>
        ) : (
          <Link
            to="/auth"
            onClick={() => setIsMenuOpen(false)}
            className="w-full flex items-center justify-center h-12 px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
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
