
import React from "react";
import { useTranslation } from "@/contexts/LanguageContext";
import NavLink from "./NavLink";
import { useIsMobile } from "@/hooks/use-mobile";

interface MainLinksProps {
  isActive: (path: string) => boolean;
  closeMenu: () => void;
}

const MainLinks = ({ isActive, closeMenu }: MainLinksProps) => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  return (
    <>
      <NavLink href="/" active={isActive("/")} onClick={closeMenu}>
        {t("nav.home")}
      </NavLink>
      {/* Показываем кнопку каталога только на десктопе */}
      {!isMobile && (
        <NavLink href="/catalog" active={isActive("/catalog")} onClick={closeMenu}>
          {t("nav.catalog")}
        </NavLink>
      )}
    </>
  );
};

export default MainLinks;
