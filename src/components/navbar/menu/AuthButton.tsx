
import React from "react";
import { Link } from "react-router-dom";
import { LogOut, User } from "lucide-react";
import { useTranslation } from "@/contexts/LanguageContext";

interface AuthButtonProps {
  user: any;
  handleSignOut: () => void;
  closeMenu: () => void;
}

const AuthButton = ({ user, handleSignOut, closeMenu }: AuthButtonProps) => {
  const { t } = useTranslation();

  return user ? (
    <button
      onClick={() => {
        handleSignOut();
        closeMenu();
      }}
      className="w-full flex items-center justify-center h-12 px-4 py-2 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground touch-manipulation"
    >
      <LogOut className="mr-2 h-4 w-4" />
      {t("nav.logout")}
    </button>
  ) : (
    <Link
      to="/auth"
      onClick={closeMenu}
      className="w-full flex items-center justify-center h-12 px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 touch-manipulation"
    >
      <User className="mr-2 h-4 w-4" />
      {t("nav.login")}
    </Link>
  );
};

export default AuthButton;
