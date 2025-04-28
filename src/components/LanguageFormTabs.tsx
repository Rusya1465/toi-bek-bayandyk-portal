
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useTranslation } from "@/contexts/LanguageContext";
import { ReactNode } from "react";
import { Globe } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface LanguageFormTabsProps {
  mainContent: ReactNode;
  alternateContent: ReactNode;
  alternateLanguage: "ky" | "ru";
  description?: ReactNode;
}

export const LanguageFormTabs = ({
  mainContent,
  alternateContent,
  alternateLanguage,
  description
}: LanguageFormTabsProps) => {
  const { language, t } = useTranslation();
  const isMobile = useIsMobile();
  
  const mainLang = language;
  const altLang = alternateLanguage;
  
  return (
    <div className="space-y-2">
      {description && (
        <div className="text-sm text-muted-foreground mb-2 flex items-center">
          <Globe className="h-4 w-4 mr-2 flex-shrink-0" />
          <span className="line-clamp-2">{description}</span>
        </div>
      )}
      <Tabs defaultValue={mainLang} className="w-full">
        <TabsList className="grid grid-cols-2 mb-2 w-full">
          <TabsTrigger value={mainLang}>
            {mainLang === "ky" ? (
              <span className="flex items-center">
                <span className="mr-1">🇰🇬</span>
                <span className={isMobile ? "hidden sm:inline" : ""}>Кыргызча</span>
                {isMobile && <span className="sm:hidden">КЫР</span>}
              </span>
            ) : (
              <span className="flex items-center">
                <span className="mr-1">🇷🇺</span>
                <span className={isMobile ? "hidden sm:inline" : ""}>Русский</span>
                {isMobile && <span className="sm:hidden">РУС</span>}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value={altLang}>
            {altLang === "ky" ? (
              <span className="flex items-center">
                <span className="mr-1">🇰🇬</span>
                <span className={isMobile ? "hidden sm:inline" : ""}>Кыргызча</span>
                {isMobile && <span className="sm:hidden">КЫР</span>}
              </span>
            ) : (
              <span className="flex items-center">
                <span className="mr-1">🇷🇺</span>
                <span className={isMobile ? "hidden sm:inline" : ""}>Русский</span>
                {isMobile && <span className="sm:hidden">РУС</span>}
              </span>
            )}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value={mainLang} className="p-0 border-0">
          {mainContent}
        </TabsContent>
        
        <TabsContent value={altLang} className="p-0 border-0">
          {alternateContent}
        </TabsContent>
      </Tabs>
    </div>
  );
};
