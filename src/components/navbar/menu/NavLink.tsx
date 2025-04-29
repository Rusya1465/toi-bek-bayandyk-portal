
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface NavLinkProps {
  href: string;
  icon?: React.ReactNode;
  active?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}

const NavLink = ({
  href,
  icon,
  active,
  children,
  onClick
}: NavLinkProps) => {
  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      onClick();
    }
  };
  
  return (
    <Link
      to={href}
      className={cn(
        "flex items-center gap-2 rounded-md px-3 py-2 text-base transition-colors",
        "hover:bg-muted/80 active:bg-muted",
        "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
        active
          ? "bg-muted font-medium text-foreground"
          : "font-normal text-muted-foreground"
      )}
      onClick={handleClick}
    >
      {icon && (
        <span className="h-5 w-5">{icon}</span>
      )}
      <span>{children}</span>
    </Link>
  );
};

export default NavLink;
