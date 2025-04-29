
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface NavLinkProps {
  to: string;
  isActive: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

const NavLink = ({ to, isActive, onClick, children }: NavLinkProps) => (
  <Link
    to={to}
    className={cn(
      "flex items-center py-3 px-4 text-lg font-medium rounded-md transition-colors touch-manipulation", 
      "min-h-[48px]", // Увеличиваем область для тапа до рекомендуемых 48px
      isActive ? "text-primary bg-primary/5" : "text-foreground hover:bg-muted/50"
    )}
    onClick={(e) => {
      e.preventDefault(); // Предотвращаем дефолтное поведение для надежности
      onClick(); // Закрываем меню
      
      // Используем setTimeout для предотвращения конфликтов с другими обработчиками
      setTimeout(() => {
        window.location.href = to.startsWith('/') ? to : `/${to}`;
      }, 10);
    }}
    aria-current={isActive ? "page" : undefined}
    role="menuitem"
  >
    {children}
  </Link>
);

export default NavLink;
