
import React from "react";
import { useTranslation } from "@/contexts/LanguageContext";
import NavLink from "./NavLink";

interface MainLinksProps {
  isActive: (path: string) => boolean;
  closeMenu: () => void;
}

const MainLinks = ({ isActive, closeMenu }: MainLinksProps) => {
  const { t } = useTranslation();

  return (
    <>
      <NavLink to="/" isActive={isActive("/")} onClick={closeMenu}>
        {t("nav.home")}
      </NavLink>
      <NavLink to="/catalog" isActive={isActive("/catalog")} onClick={closeMenu}>
        {t("nav.catalog")}
      </NavLink>
    </>
  );
};

export default MainLinks;
