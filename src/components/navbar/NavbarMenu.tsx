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

  // We're keeping the event handlers but they won't be used anymore
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent | TouchEvent) => {
      // Check if menu is open and click was outside menu
      if (isMenuOpen && 
          menuRef.current && 
          !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      // Add event listeners with a small delay to prevent immediate triggering
      const timer = setTimeout(() => {
        document.addEventListener('mousedown', handleOutsideClick);
        document.addEventListener('touchstart', handleOutsideClick);
        document.addEventListener('keydown', handleEscapeKey);
      }, 100);
      
      return () => {
        clearTimeout(timer);
        document.removeEventListener('mousedown', handleOutsideClick);
        document.removeEventListener('touchstart', handleOutsideClick);
        document.removeEventListener('keydown', handleEscapeKey);
      };
    }
    
    return undefined;
  }, [isMenuOpen, setIsMenuOpen]);

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <div 
      id="mobile-menu"
      ref={menuRef}
      className={cn(
        "fixed top-16 left-0 right-0 bottom-0 z-40 bg-background/95 backdrop-blur", 
        "transition-all duration-200 ease-in-out",
        "hidden", // Always hide the menu now
        "opacity-0 pointer-events-none" // Always disabled
      )}
      aria-hidden="true"
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
