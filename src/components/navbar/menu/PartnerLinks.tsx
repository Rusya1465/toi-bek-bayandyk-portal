
import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Plus, ShoppingBag } from "lucide-react";
import { useTranslation } from "@/contexts/LanguageContext";
import NavLink from "./NavLink";

interface PartnerLinksProps {
  isActive: (path: string) => boolean;
  closeMenu: () => void;
}

const PartnerLinks = ({ isActive, closeMenu }: PartnerLinksProps) => {
  const { t } = useTranslation();

  return (
    <>
      <div className="h-px bg-border my-4"></div>
      <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider px-1">
        {t("nav.services")}
      </p>
      
      <NavLink href="/create-event" active={isActive("/create-event")} onClick={closeMenu}>
        <Plus className="mr-3 h-5 w-5" />
        {t("nav.createEvent")}
      </NavLink>
      <NavLink href="/profile/services" active={isActive("/profile/services")} onClick={closeMenu}>
        <ShoppingBag className="mr-3 h-5 w-5" />
        {t("nav.services")}
      </NavLink>
    </>
  );
};

export default PartnerLinks;
