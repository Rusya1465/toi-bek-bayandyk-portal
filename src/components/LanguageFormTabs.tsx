
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useTranslation } from "@/contexts/LanguageContext";
import { ReactNode } from "react";
import { Globe } from "lucide-react";

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
  
  const mainLang = language;
  const altLang = alternateLanguage;
  
  return (
    <div className="space-y-2">
      {description && (
        <div className="text-sm text-muted-foreground mb-2 flex items-center">
          <Globe className="h-4 w-4 mr-2" />
          {description}
        </div>
      )}
      <Tabs defaultValue={mainLang} className="w-full">
        <TabsList className="grid grid-cols-2 mb-2">
          <TabsTrigger value={mainLang}>
            {mainLang === "ky" ? "🇰🇬 Кыргызча" : "🇷🇺 Русский"}
          </TabsTrigger>
          <TabsTrigger value={altLang}>
            {altLang === "ky" ? "🇰🇬 Кыргызча" : "🇷🇺 Русский"}
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
