
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/contexts/LanguageContext";
import MenuContent from "./menu/MenuContent";

interface NavbarMenuProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
  toggleMenu: (e?: React.MouseEvent | React.TouchEvent) => void;
  isAdmin: boolean;
  isPartner: boolean;
  handleSignOut: () => void;
  user: any;
}

const NavbarMenu = ({
  isMenuOpen,
  setIsMenuOpen,
  toggleMenu,
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
        // Используем setTimeout для предотвращения конфликта с другими обработчиками событий
        setTimeout(() => {
          setIsMenuOpen(false);
          console.log("Menu closed by outside click");
        }, 0);
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false);
        console.log("Menu closed by Escape key");
      }
    };

    // Используем passive: true для улучшения производительности на тачскринах
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleOutsideClick, { passive: true });
      document.addEventListener('touchstart', handleOutsideClick, { passive: true });
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
    console.log("Menu closed by closeMenu function");
  };

  // Более надежное отображение меню с улучшенными анимациями
  return (
    <div 
      id="mobile-menu"
      ref={menuRef}
      className={cn(
        "mobile-menu fixed top-16 left-0 right-0 bottom-0 z-40 bg-background/95 backdrop-blur-md", 
        isMenuOpen 
          ? "opacity-100 translate-y-0 pointer-events-auto visible animate-in slide-in-from-top duration-300 ease-in-out" 
          : "opacity-0 -translate-y-4 pointer-events-none invisible animate-out slide-out-to-top duration-200 ease-in-out",
        "md:hidden"
      )}
      aria-hidden={!isMenuOpen}
      role="dialog"
      aria-modal="true"
      aria-labelledby="mobile-menu-heading"
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
