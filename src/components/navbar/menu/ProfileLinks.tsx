
import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { User, Heart, History } from "lucide-react";
import { useTranslation } from "@/contexts/LanguageContext";
import NavLink from "./NavLink";

interface ProfileLinksProps {
  isActive: (path: string) => boolean;
  closeMenu: () => void;
}

const ProfileLinks = ({ isActive, closeMenu }: ProfileLinksProps) => {
  const { t } = useTranslation();

  return (
    <>
      <div className="h-px bg-border my-4"></div>
      <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider px-1">
        {t("nav.profile")}
      </p>
      
      <NavLink href="/profile" active={isActive("/profile")} onClick={closeMenu}>
        <User className="mr-3 h-5 w-5" />
        {t("nav.profile")}
      </NavLink>
      <NavLink href="/profile/favorites" active={isActive("/profile/favorites")} onClick={closeMenu}>
        <Heart className="mr-3 h-5 w-5" />
        {t("nav.favorites")}
      </NavLink>
      <NavLink href="/profile/history" active={isActive("/profile/history")} onClick={closeMenu}>
        <History className="mr-3 h-5 w-5" />
        {t("nav.history")}
      </NavLink>
    </>
  );
};

export default ProfileLinks;
