
import React from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "@/contexts/LanguageContext";
import MainLinks from "./MainLinks";
import ProfileLinks from "./ProfileLinks";
import PartnerLinks from "./PartnerLinks";
import AdminLink from "./AdminLink";
import AuthButton from "./AuthButton";
import NavLink from "./NavLink";
import { ShoppingBag } from "lucide-react";

interface MenuContentProps {
  user: any;
  isPartner: boolean;
  isAdmin: boolean;
  handleSignOut: () => void;
  closeMenu: () => void;
}

const MenuContent = ({
  user,
  isPartner,
  isAdmin,
  handleSignOut,
  closeMenu
}: MenuContentProps) => {
  const location = useLocation();
  const { t } = useTranslation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="container py-6 space-y-6 overflow-y-auto h-full pb-safe">
      <h2 id="mobile-menu-heading" className="sr-only">{t("nav.mobileMenu")}</h2>
      <nav className="space-y-4" role="menu" aria-labelledby="mobile-menu-heading">
        <MainLinks isActive={isActive} closeMenu={closeMenu} />
        
        {/* Добавляем кнопку каталога в мобильном меню */}
        <NavLink href="/catalog" active={isActive("/catalog")} onClick={closeMenu}>
          <ShoppingBag className="mr-3 h-5 w-5" />
          {t("nav.catalog")}
        </NavLink>
        
        {user && (
          <ProfileLinks isActive={isActive} closeMenu={closeMenu} />
        )}
        
        {isPartner && (
          <PartnerLinks isActive={isActive} closeMenu={closeMenu} />
        )}
        
        {isAdmin && (
          <AdminLink isActive={isActive} closeMenu={closeMenu} />
        )}
      </nav>
      
      <div className="h-px bg-border" aria-hidden="true"></div>
      
      <AuthButton 
        user={user} 
        handleSignOut={handleSignOut} 
        closeMenu={closeMenu} 
      />
    </div>
  );
};

export default MenuContent;
