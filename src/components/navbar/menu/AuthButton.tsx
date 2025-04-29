
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

  // Упрощенная обработка для выхода
  const handleSignOutClick = (e: React.MouseEvent) => {
    e.preventDefault();
    closeMenu();
    setTimeout(() => {
      handleSignOut();
    }, 100);
  };

  // Упрощенная обработка для перехода на страницу авторизации
  const handleAuthClick = (e: React.MouseEvent) => {
    e.preventDefault();
    closeMenu();
    setTimeout(() => {
      window.location.href = "/auth";
    }, 100);
  };

  return user ? (
    <button
      onClick={handleSignOutClick}
      className="w-full flex items-center justify-center h-12 px-4 py-2 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
      aria-label={t("nav.logout")}
    >
      <LogOut className="mr-2 h-4 w-4" />
      {t("nav.logout")}
    </button>
  ) : (
    <button
      onClick={handleAuthClick}
      className="w-full flex items-center justify-center h-12 px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
      aria-label={t("nav.login")}
    >
      <User className="mr-2 h-4 w-4" />
      {t("nav.login")}
    </button>
  );
};

export default AuthButton;
