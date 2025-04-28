
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/contexts/LanguageContext";

export const LanguageSwitch = () => {
  const { language, setLanguage } = useTranslation();

  const toggleLanguage = () => {
    setLanguage(language === "ky" ? "ru" : "ky");
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className="font-medium"
      onClick={toggleLanguage}
    >
      {language === "ky" ? "RU" : "KG"}
    </Button>
  );
};
