
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/contexts/LanguageContext";
import MenuContent from "./menu/MenuContent";

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
  const { t } = useTranslation();
  const menuRef = useRef<HTMLDivElement>(null);

  // Улучшенная обработка событий и закрытие меню при клике вне
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent | TouchEvent) => {
      // Проверяем, что меню открыто и клик был вне меню
      if (isMenuOpen && menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('touchstart', handleOutsideClick);
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isMenuOpen, setIsMenuOpen]);

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Упрощенное отображение меню с улучшенными анимациями
  return (
    <div 
      id="mobile-menu"
      ref={menuRef}
      className={cn(
        "fixed top-16 left-0 right-0 bottom-0 z-40 bg-background/95 backdrop-blur", 
        isMenuOpen 
          ? "opacity-100 pointer-events-auto" 
          : "opacity-0 pointer-events-none",
        "transition-opacity duration-200 ease-in-out",
        "md:hidden"
      )}
      aria-hidden={!isMenuOpen}
    >
      <MenuContent
        user={user}
        isPartner={isPartner}
        isAdmin={isAdmin}
        handleSignOut={handleSignOut}
        closeMenu={closeMenu}
      />
    </div>
  );
};

export default NavbarMenu;
