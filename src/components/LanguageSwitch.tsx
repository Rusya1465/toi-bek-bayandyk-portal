
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/contexts/LanguageContext";

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
      {language === "ky" ? (
        <>
          <span className="mr-1">🇰🇬</span> KG
        </>
      ) : (
        <>
          <span className="mr-1">🇷🇺</span> RU
        </>
      )}
    </Button>
  );
};
