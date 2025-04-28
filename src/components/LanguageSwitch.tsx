
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

  return (
    <Button
      variant="outline"
      size={isMobile ? "sm" : "sm"}
      className={`font-medium flex items-center ${isMobile ? 'px-2' : 'gap-1'}`}
      onClick={toggleLanguage}
    >
      <Globe className={`h-4 w-4 ${isMobile ? '' : 'mr-1'}`} />
      {!isMobile ? (
        language === "ky" ? (
          <>
            <span className="mr-1">🇰🇬</span> КЫР
          </>
        ) : (
          <>
            <span className="mr-1">🇷🇺</span> РУС
          </>
        )
      ) : (
        language === "ky" ? (
          <span className="ml-1">🇰🇬</span>
        ) : (
          <span className="ml-1">🇷🇺</span>
        )
      )}
    </Button>
  );
};
