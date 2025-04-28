
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/contexts/LanguageContext";

interface DesktopNavProps {
  isActive: (path: string) => boolean;
  isAdmin: boolean;
}

const DesktopNav = ({ isActive, isAdmin }: DesktopNavProps) => {
  const { t } = useTranslation();

  return (
    <nav className="hidden md:flex flex-1 items-center justify-center">
      <div className="flex items-center space-x-4 lg:space-x-6">
        <Link
          to="/"
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            isActive("/") ? "text-primary" : "text-muted-foreground"
          )}
        >
          {t("nav.home")}
        </Link>
        <Link
          to="/catalog"
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            isActive("/catalog") ? "text-primary" : "text-muted-foreground"
          )}
        >
          {t("nav.catalog")}
        </Link>
        {isAdmin && (
          <Link
            to="/admin"
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
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
