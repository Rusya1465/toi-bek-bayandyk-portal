import { Button } from "@/components/ui/button";
import { useTranslation } from "@/contexts/LanguageContext";
import { Globe } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

export const LanguageSwitch = () => {
  const { language, setLanguage } = useTranslation();
  const isMobile = useIsMobile();

  const toggleLanguage = () => {
    const newLanguage = language === "ky" ? "ru" : "ky";
    console.log('🌐 LanguageSwitch: Toggling language to', newLanguage);
    setLanguage(newLanguage);
  };

  const isKyrgyz = language === "ky";

  // Simple switch between languages with appropriate sizing for mobile/desktop
  return (
    <Button
      variant="outline"
      size={isMobile ? "icon" : "sm"}
      className={`font-medium flex items-center gap-1.5 transition-all ${
        isKyrgyz ? "border-green-500/50" : "border-blue-500/50"
      }`}
      onClick={toggleLanguage}
      title={isKyrgyz ? "Переключить на русский" : "Кыргызчага которуу"}
    >
      {isMobile ? (
        <span className="text-base">{isKyrgyz ? "🇰🇬" : "🇷🇺"}</span>
      ) : (
        <>
          <Globe className="h-4 w-4" />
          <span className="font-semibold">{isKyrgyz ? "🇰🇬 КЫР" : "🇷🇺 РУС"}</span>
        </>
      )}
    </Button>
  );
};
