
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "@/contexts/LanguageContext";

interface AuthButtonProps {
  user: any;
  handleSignOut: () => void;
  closeMenu: () => void;
}

const AuthButton = ({ user, handleSignOut, closeMenu }: AuthButtonProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const handleAuthAction = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event bubbling
    
    if (user) {
      handleSignOut();
    } else {
      navigate("/auth");
    }
    
    closeMenu();
  };
  
  return (
    <Button
      variant="outline"
      size="lg"
      className="w-full justify-start gap-2"
      onClick={handleAuthAction}
    >
      {user ? (
        <>
          <LogOut className="h-4 w-4" />
          <span>{t("nav.logout")}</span>
        </>
      ) : (
        <span>{t("nav.login")}</span>
      )}
    </Button>
  );
};

export default AuthButton;
