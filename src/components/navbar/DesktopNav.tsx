
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/contexts/LanguageContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { ShoppingBag } from "lucide-react";

interface DesktopNavProps {
  isActive: (path: string) => boolean;
  isAdmin: boolean;
}

const DesktopNav = ({ isActive, isAdmin }: DesktopNavProps) => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  return (
    <nav className="flex flex-1 items-center justify-center">
      <div className="flex items-center space-x-2 lg:space-x-6">
        <Link
          to="/"
          className={cn(
            "flex items-center font-medium transition-colors hover:text-primary",
            isMobile ? "text-xs px-2 py-1" : "text-sm px-3 py-2",
            isActive("/") ? "text-primary" : "text-muted-foreground"
          )}
        >
          {t("nav.home")}
        </Link>
        <Link
          to="/catalog"
          className={cn(
            "flex items-center transition-colors hover:text-primary",
            isMobile ? "text-xs px-2 py-1" : "text-sm px-3 py-2",
            isActive("/catalog") ? "text-primary" : "text-muted-foreground"
          )}
        >
          {isMobile ? (
            <ShoppingBag className="h-4 w-4" /> 
          ) : (
            <span className="font-medium">{t("nav.catalog")}</span>
          )}
        </Link>
        {isAdmin && (
          <Link
            to="/admin"
            className={cn(
              "flex items-center font-medium transition-colors hover:text-primary",
              isMobile ? "text-xs px-2 py-1" : "text-sm px-3 py-2",
              isActive("/admin") ? "text-primary" : "text-muted-foreground"
            )}
          >
            {t("nav.admin")}
          </Link>
        )}
      </div>
    </nav>
  );
};

export default DesktopNav;
