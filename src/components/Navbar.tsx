import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { LanguageSwitch } from "@/components/LanguageSwitch";
import { useTranslation } from "@/contexts/LanguageContext";
import UserDropdown from "@/components/navbar/UserDropdown";
import DesktopNav from "@/components/navbar/DesktopNav";

const Navbar = () => {
  const { user, profile, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { t } = useTranslation();
  
  // Close menu when route changes - keeping this in case we need similar logic in the future
  useEffect(() => {
    // No longer need to close menu on route change, but keeping this hook for potential future use
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

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <span className="inline-block font-bold text-xl text-kyrgyz-red">
              ToiBek
            </span>
          </Link>
        </div>
        
        {/* Nav links - now visible on all devices */}
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
        </div>
      </div>
    </header>
  );
};

export default Navbar;
