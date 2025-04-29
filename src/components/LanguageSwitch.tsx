
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/contexts/LanguageContext";
import { Globe } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

export const LanguageSwitch = () => {
  const { language, setLanguage } = useTranslation();
  const isMobile = useIsMobile();

  const toggleLanguage = () => {
    setLanguage(language === "ky" ? "ru" : "ky");
  };

  // Simple switch between languages with appropriate sizing for mobile/desktop
  return (
    <Button
      variant="outline"
      size={isMobile ? "icon" : "sm"}
      className="font-medium flex items-center"
      onClick={toggleLanguage}
    >
      {isMobile ? (
        <Globe className="h-4 w-4" />
      ) : (
        <>
          <Globe className="h-4 w-4 mr-1" />
          {language === "ky" ? "🇰🇬 КЫР" : "🇷🇺 РУС"}
        </>
      )}
    </Button>
  );
};
