
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/contexts/LanguageContext";
import { Globe } from "lucide-react";

export const LanguageSwitch = () => {
  const { language, setLanguage } = useTranslation();

  const toggleLanguage = () => {
    setLanguage(language === "ky" ? "ru" : "ky");
  };

  return (
    <Button
      variant="outline"
      size="sm"
      className="font-medium flex items-center gap-1"
      onClick={toggleLanguage}
    >
      <Globe className="h-4 w-4 mr-1" />
      {language === "ky" ? (
        <>
          <span className="mr-1">🇰🇬</span> КЫР
        </>
      ) : (
        <>
          <span className="mr-1">🇷🇺</span> РУС
        </>
      )}
    </Button>
  );
};
