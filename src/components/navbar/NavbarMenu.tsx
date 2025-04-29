
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

  // Handle touch events and close menu when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent | TouchEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      // Use capture phase to ensure we get the event first
      document.addEventListener('mousedown', handleOutsideClick, { capture: true });
      document.addEventListener('touchstart', handleOutsideClick, { capture: true, passive: true });
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick, { capture: true });
      document.removeEventListener('touchstart', handleOutsideClick, { capture: true });
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isMenuOpen, setIsMenuOpen]);

  const closeMenu = () => setIsMenuOpen(false);

  // We always render the menu but control visibility with CSS
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
