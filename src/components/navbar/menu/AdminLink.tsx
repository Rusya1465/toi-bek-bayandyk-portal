
import React from "react";
import { Settings } from "lucide-react";
import { useTranslation } from "@/contexts/LanguageContext";
import NavLink from "./NavLink";

interface AdminLinkProps {
  isActive: (path: string) => boolean;
  closeMenu: () => void;
}

const AdminLink = ({ isActive, closeMenu }: AdminLinkProps) => {
  const { t } = useTranslation();

  return (
    <>
      <div className="h-px bg-border my-4"></div>
      <NavLink href="/admin" active={isActive("/admin")} onClick={closeMenu}>
        <Settings className="mr-3 h-5 w-5" />
        {t("nav.admin")}
      </NavLink>
    </>
  );
};

export default AdminLink;
